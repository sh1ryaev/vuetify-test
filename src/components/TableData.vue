<template>
  <div class="container">
    <v-data-table
      :headers="headers"
      :items="staff"
      sort-by="calories"
      class="elevation-1"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      @page-count="pageCount = $event"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Список сотрудников</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Поиск..."
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Добавить сотрудника
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.surname"
                          label="Фамилия"
                          :rules="surnameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Имя"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.patronymic"
                          label="Отчество"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="editedItem.position"
                          label="Должность"
                          :rules="positionRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          type="number"
                          v-model="editedItem.salary"
                          label="Оклад"
                          :rules="salaryRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          :return-value.sync="editedItem.salary"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.dateOfEmployment"
                              label="Дата выхода на работу"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.dateOfEmployment"
                            no-title
                            scrollable
                            :rules="[
                              (v) => !!v || 'Поле обязательно для заполнения',
                            ]"
                            required
                          >
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu = false">
                              Отмена
                            </v-btn>
                            <v-btn
                              text
                              color="primary"
                              @click="
                                $refs.menu.save(editedItem.dateOfEmployment)
                              "
                            >
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="6">
                        <v-select
                          v-model="editedItem.rate"
                          :items="rateList"
                          :rules="[
                            (v) => !!v || 'Поле обязательно для заполнения',
                          ]"
                          label="Ставка"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-checkbox
                          v-model="editedItem.hasWorkBookHanded"
                          label="Трудовая книжка сдана"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Отмена
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Сохранить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h6"
                >Вы уверены, что хотите удалить эту запись?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Отмена</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:[`item.profile`]="{ item }">
        <v-icon small class="ml-2" @click="viewProfile(item)">
          mdi-account
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Сбросить </v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
      <v-text-field
        :value="itemsPerPage"
        label="Количество записей на странице"
        type="number"
        min="1"
        max="15"
        @input="itemsPerPage = parseInt($event, 10)"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableData",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: "",
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,
    headers: [
      { text: "Профиль", value: "profile", align: "start", sortable: false },
      { text: "Фамилия", value: "surname" },
      { text: "Имя", value: "name" },
      { text: "Отчество", value: "patronymic" },
      { text: "Должность", value: "position" },
      { text: "Действия", value: "actions", sortable: false },
    ],
    footer: { pageText: "dfdf" },
    staff: [],
    editedIndex: -1,
    rateList: ["полная", "половина"],
    editedItem: {
      name: "",
      surname: "",
      patronymic: "",
      position: "",
      hasWorkBookHanded: "",
      salary: "",
      dateOfEmployment: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      rate: "",
    },
    defaultItem: {
      name: "",
      surname: "",
      patronymic: "",
      position: "",
      hasWorkBookHanded: "",
      salary: "",
      dateOfEmployment: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      rate: "",
    },
    valid: true,
    nameRules: [
      (v) => !!v || "Поле обязательно для заполнения",
      (v) =>
        (v && v.length >= 3 && v.length <= 30) || "Длина имени некорректна!",
    ],
    surnameRules: [
      (v) => !!v || "Поле обязательно для заполнения",
      (v) =>
        (v && v.length >= 3 && v.length <= 30) || "Длина фамилии некорректна!",
    ],
    positionRules: [
      (v) => !!v || "Поле обязательно для заполнения",
      (v) =>
        (v && v.length >= 3 && v.length <= 30) ||
        "Длина должности некорректна!",
    ],
    salaryRules: [
      (v) => !!v || "Поле обязательно для заполнения",
      (v) => (v && v >= 1 && v <= 10000000) || "Длина оклада некорректна!",
    ],
    menu: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Добавить запись" : "Изменить запись";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize: function () {
      var defaultStaff = [
        {
          surname: "Иванов",
          name: "Иван",
          patronymic: "Иванович",
          position: "Junior",
          hasWorkBookHanded: true,
          salary: 20000,
          dateOfEmployment: "2022-07-19",
          rate: "половина",
        },
        {
          surname: "Сергеев",
          name: "Сергей",
          patronymic: "Сергеевич",
          position: "Middle",
          hasWorkBookHanded: false,
          salary: 50000,
          dateOfEmployment: "2022-07-19",
          rate: "полная",
        },
        {
          surname: "Петров",
          name: "Петр",
          patronymic: "Петрович",
          position: "Senior",
          hasWorkBookHanded: true,
          salary: 100000,
          dateOfEmployment: "2022-07-19",
          rate: "полная",
        },
        {
          surname: "Иванов",
          name: "Иван",
          patronymic: "Иванович",
          position: "Junior",
          hasWorkBookHanded: true,
          salary: 20000,
          dateOfEmployment: "2022-07-19",
          rate: "половина",
        },
        {
          surname: "Сергеев",
          name: "Сергей",
          patronymic: "Сергеевич",
          position: "Middle",
          hasWorkBookHanded: false,
          salary: 50000,
          dateOfEmployment: "2022-07-19",
          rate: "полная",
        },
        {
          surname: "Петров",
          name: "Петр",
          patronymic: "Петрович",
          position: "Senior",
          hasWorkBookHanded: true,
          salary: 100000,
          dateOfEmployment: "2022-07-19",
          rate: "полная",
        },
      ];
      if (localStorage.length < 1) {
        defaultStaff.forEach((item, index) =>
          localStorage.setItem(index, JSON.stringify(item))
        );
      }
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        var item = localStorage.getItem(key);
        this.staff.push(JSON.parse(item));
      }
    },
    viewProfile(item) {
      let key = localStorage.key(this.staff.indexOf(item));
      this.$router.push({ name: "profile", params: { staffKey: key } });
    },
    editItem(item) {
      this.editedIndex = this.staff.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.staff.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.staff.splice(this.editedIndex, 1);
      let key = localStorage.key(this.editedIndex);
      localStorage.removeItem(key);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          Object.assign(this.staff[this.editedIndex], this.editedItem);
          let key = localStorage.key(this.editedIndex);
          localStorage.setItem(key, JSON.stringify(this.editedItem));
        } else {
          this.staff.push(this.editedItem);
          localStorage.setItem(
            this.editedIndex,
            JSON.stringify(this.editedItem)
          );
        }
        this.close();
      }
    },
  },
};
</script>

<style scoped></style>
