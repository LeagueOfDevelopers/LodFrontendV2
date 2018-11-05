import Home from "../pages/Home.vue";
import NotFound from "../pages/NotFound.vue";
import Projects from "../pages/Projects.vue";
import Developers from "../pages/Developers.vue";
import Signup from "../pages/Signup.vue";
import About from "../pages/About.vue";
import Contact from "../pages/Contact.vue";

export const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "Лига Разработчиков НИТУ МИСиС"
    }
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
    meta: {
      title: "Лига Разработчиков НИТУ МИСиС - Стать разразработчиком"
    }
  },
  {
    path: "/password/recovery/:token",
    props: true
  },
  {
    path: "/login/github/:encoded_token",
    props: route => ({
      encodedToken: route.params.encoded_token,
      success: route.query.success
    })
  },
  {
    path: "/notifications",
    name: "notifications",
    meta: {
      title: "Лига Разработчиков НИТУ МИСиС - Оповещения"
    }
  },
  {
    path: "/contact",
    name: "contact",
    component: Contact,
    meta: {
      title: "Лига Разработчиков НИТУ МИСиС - Связаться"
    }
  },
  {
    path: "/about",
    name: "about",
    component: About,
    meta: {
      title: "Лига Разработчиков НИТУ МИСиС - О нас"
    }
  },
  {
    path: "/signup?registration_type&success",
    props: route => ({
      registrationType: route.query.registration_type,
      success: route.query.success
    })
  },
  {
    path: "/admin",
    name: "admin_main"
  },
  {
    path: "/admin/projects",
    name: "admin_projects"
  },
  {
    path: "/admin/projects/add?action&repository_link&success",
    props: route => ({
      action: route.query.action,
      repositoryLink: route.query.repository_link,
      success: route.query.success
    })
  },
  {
    path: "/admin/projects/edit/:id?action&success&repository_link",
    props: route => ({
      id: route.params.id,
      action: route.query.action,
      repositoryLink: route.query.repository_link,
      success: route.query.success
    })
  },
  {
    path: "/admin/notification"
  },
  {
    path: "/admin/developers",
    name: "admin_developers"
  },
  {
    path: "/developers",
    name: "developers",
    component: Developers,
    meta: {
      title: "Лига Разработчиков НИТУ МИСиС - Разработчики"
    }
  },
  {
    path: "/developers/:id",
    name: "portfolio",
    props: true
  },
  {
    path: "/developers/confirmation/:token",
    props: true
  },
  {
    path: "/developers/profile/:id?success",
    name: "profile",
    props: route => ({
      id: route.params.id,
      success: route.query.success
    })
  },
  {
    path: "/projects",
    name: "projects",
    component: Projects,
    meta: {
      title: "Лига Разработчиков НИТУ МИСиС - Проекты"
    }
  },
  {
    path: "/projects/:id",
    name: "project",
    props: true
  },
  {
    path: "/404",
    name: "not_found",
    component: NotFound,
    meta: {
      title: "404 - Страница не найдена"
    }
  },
  {
    path: "*",
    redirect: { name: "not_found" }
  }
];
