<template>
  <div>
    <div v-if="isEmpty">
      <v-alert
        color="red"
        elevation="17"
        prominent
        shaped
        type="warning"
        max-width="600"
        >Пользователя с таким ключом не найдено!!!</v-alert
      >
    </div>
    <div v-else>
      <v-card
        :loading="loading"
        class="mx-auto my-12 text-center"
        max-width="900"
      >
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-row>
          <v-col cols="12" sm="12" xs="12" md="6">
            <v-img
              src="https://erastech.com/wp-content/uploads/2015/08/placeholder_male1.jpg"
              height="300px"
            ></v-img>
          </v-col>
          <v-col cols="12" sm="12" xs="12" md="6">
            <v-card-title class="justify-space-around">
              {{ fullName }}
            </v-card-title>
            <v-card-subtitle>
              <strong>Должность:</strong> {{ staff.position }}
            </v-card-subtitle>
            <v-card-subtitle>
              <strong>Оклад:</strong> {{ staff.salary }} ₽
            </v-card-subtitle>
            <v-card-subtitle>
              <strong>Дата выхода на работу:</strong>
              {{ staff.dateOfEmployment }}
            </v-card-subtitle>
            <v-card-subtitle>
              <strong>Ставка:</strong> {{ staff.rate }}
            </v-card-subtitle>
            <v-checkbox
              v-model="staff.hasWorkBookHanded"
              label="Трудовая книжка сдана"
              disabled
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  name: "StaffProfile",
  data: () => ({
    loading: false,
    selection: 1,
    staff: "",
    fullName: "",
    isEmpty: false,
  }),
  mounted() {
    this.initStaff();
    if (!this.isEmpty) {
      this.fullName =
        this.staff.surname +
        " " +
        this.staff.name +
        " " +
        this.staff.patronymic;
    }
  },
  methods: {
    initStaff() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000);
      var key = this.$route.params.staffKey;
      this.staff = JSON.parse(localStorage.getItem(key));
      if (!this.staff) {
        this.isEmpty = true;
      }
    },
  },
};
</script>
<style scoped></style>
