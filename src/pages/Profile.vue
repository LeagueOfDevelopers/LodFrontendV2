<template>
  <div class="developer-page">
    <ProfileHeader 
      name="Ricardo Milos"
      role="Frontend developer"
      photoUrl="https://i.ytimg.com/vi/aVeCYjAiQHo/maxresdefault.jpg"
      :confirmationStatus="2"
    />

    <div class="dividing-line"></div>

    <DeveloperInfo
      institute="string"
      faculty="faculty"
      specialization="specialization"
      :course="1"
      :date="new Date(1394523456661) | normalizeDate"
      profileVk="profileVk"
      email="email"
      phoneNumber="phoneNumber"
    />

    <div class="dividing-line"></div>

    <DeveloperPortfolio>
      <DeveloperProject
        v-for="i in 7"
        :key="i"
        name="name"
        :status="2"
        role="backend"
        imgUrl="https://s3-us-west-2.amazonaws.com/m.cdpn.io/default-project-screenshot-large.png"
      />
    </DeveloperPortfolio>
  </div>
</template>

<script>
import ProfileHeader from "../components/profile/ProfileHeader";
import DeveloperInfo from "../components/profile/DeveloperInfo";
import DeveloperPortfolio from "../components/profile/DeveloperPortfolio";
import DeveloperProject from "../components/profile/DeveloperProject";

import { getOffsetDate } from "../helpers";

export default {
  name: "Profile",
  components: {
    ProfileHeader,
    DeveloperInfo,
    DeveloperPortfolio,
    DeveloperProject
  },
  filters: {
    normalizeDate(date) {
      return getOffsetDate(date);
    }
  }
};
</script>

