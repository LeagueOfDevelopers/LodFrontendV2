import Home from "../view_components/Home.vue";

export const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/signup",
    name: "registration"
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
    name: "notifications"
  },
  {
    path: "/contact",
    name: "contact"
  },
  {
    path: "/about",
    name: "about"
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
    name: "developers"
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
    props: route => ({
      id: route.params.id,
      success: route.query.success
    })
  },
  {
    path: "/projects",
    name: "projects"
  },
  {
    path: "/projects/:id",
    props: true
  },
  {
    path: "/success"
  },
  {
    path: "/error"
  },
  {
    path: "*"
  }
];
