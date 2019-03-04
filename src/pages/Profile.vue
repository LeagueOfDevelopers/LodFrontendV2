<template>
  <transition
    v-if="failedStatus"
    name="fade"
  >
    <NotFound />
  </transition>
  <transition
    v-else-if="availableStatus"
    name="fade"
  >
    <div class="developer-page">
      <ProfileHeader
        :name="info.firstname + ' ' + info.lastname"
        role="Frontend developer"
        :photoUrl="photo"
        :confirmationStatus="info.confirmationStatus"
      />

      <div class="dividing-line"></div>

      <DeveloperInfo
        :institute="info.instituteName"
        :faculty="info.studyingDirection"
        :specialization="info.specialization"
        :course="1"
        :date="new Date(info.registrationTime) | normalizeDate"
        :profileVk="info.vkProfileUri || 'Не указан'"
        :email="info.email || 'Не указан'"
        :phoneNumber="info.phoneNumber || 'Не указан'"
      />

      <div class="dividing-line"></div>

      <DeveloperPortfolio>
        <p
          class="no-projects"
          v-if="!info.projects.length"
        >Здесь пока ничего нет</p>
        <DeveloperProject
          v-for="(project, index) in info.projects"
          :key="index"
          :name="project.projectName"
          :status="project.projectStatus"
          :role="project.developerRole"
          :imgUrl="project.landingImage.smallPhotoUri"
        />
      </DeveloperPortfolio>
    </div>
  </transition>
</template>

<script>
import ProfileHeader from "../components/profile/ProfileHeader";
import DeveloperInfo from "../components/profile/DeveloperInfo";
import DeveloperPortfolio from "../components/profile/DeveloperPortfolio";
import DeveloperProject from "../components/profile/DeveloperProject";
import NotFound from "../pages/NotFound";
import defaultPhoto from "../assets/developer-default-photo.png";

import { getOffsetDate } from "../helpers";
import { mapActions, mapState } from "vuex";
import statuses from "../store/stateStatuses.js";

export default {
  name: "Profile",
  components: {
    ProfileHeader,
    DeveloperInfo,
    DeveloperPortfolio,
    DeveloperProject,
    NotFound
  },
  computed: {
    ...mapState("developerProfile", {
      info: state => state.developerInfo,
      profileStateStatus: state => state.developerProfileStateStatus
    }),

    availableStatus() {
      return this.profileStateStatus === statuses.available;
    },
    failedStatus() {
      return this.profileStateStatus === statuses.failed;
    },
    photo() {
      return this.info.avatar.smallPhotoUri
        ? this.info.avatar.smallPhotoUri
            .replace(/api/, "test.api")
            .replace(/image/, "images")
        : defaultPhoto;
    }
  },
  created() {
    this.loadProfileData(this.$route.params.id);
  },
  methods: {
    ...mapActions("developerProfile", {
      loadProfileData: "loadProfileData"
    })
  },
  filters: {
    normalizeDate(date) {
      return getOffsetDate(date);
    }
  }
};
</script>

<style lang="less" scoped>
.no-projects {
  margin-left: 2%;
}
</style>


