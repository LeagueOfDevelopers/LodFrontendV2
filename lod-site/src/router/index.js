import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/"
    },
    {
      path: "/signup"
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
      path: "/notifications"
    },
    {
      path: "/contact"
    },
    {
      path: "/about"
    },
    {
      path: "/signup?registration_type&success",
      props: route => ({
        registrationType: route.query.registration_type,
        success: route.query.success
      })
    },
    {
      path: "/admin"
    },
    {
      path: "/admin/projects"
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
      path: "/admin/developers"
    },
    {
      path: "/developers"
    },
    {
      path: "/developers/:id",
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
      path: "/projects"
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
  ]
});

export default router;
