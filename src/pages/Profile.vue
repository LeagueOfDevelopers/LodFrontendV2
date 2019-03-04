<template>
  <NotFound v-if="failedStatus" />
  <div
    v-else-if="availableStatus"
    class="developer-page"
  >
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
      :course="course"
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
</template>

<script>
import ProfileHeader from "../components/profile/ProfileHeader";
import DeveloperInfo from "../components/profile/DeveloperInfo";
import DeveloperPortfolio from "../components/profile/DeveloperPortfolio";
import DeveloperProject from "../components/profile/DeveloperProject";
import NotFound from "../pages/NotFound";
import defaultPhoto from "../assets/developer-default-photo.png";

import { getOffsetDate } from "../helpers";
import { mapActions, mapState, mapGetters } from "vuex";

import moment from "moment";

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

    ...mapGetters("developerProfile", ["availableStatus", "failedStatus"]),

    photo() {
      return this.info.avatar.smallPhotoUri
        ? this.info.avatar.smallPhotoUri
            .replace(/api/, "test.api")
            .replace(/image/, "images")
        : defaultPhoto;
    },

    course() {
      const accessionYear = moment([this.info.studentAccessionYear, 9, 1]);

      return moment().diff(accessionYear, "years") + 1;
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


