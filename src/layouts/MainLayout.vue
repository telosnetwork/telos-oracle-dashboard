<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Telos Oracles Demo
        </q-toolbar-title>

        <login-button></login-button>
        <div><!--Quasar v{{ $q.version }}--></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Demo Pages
        </q-item-label>
        <ExamplePage
          v-for="link in examplePages"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8">
          Project Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import ExamplePage from "components/ExamplePage.vue";
import LoginButton from "components/LoginButton.vue";

const pagesData = [
  {
    title: "Visualized Price Oracles",
    caption: "Watch the price feeds come in",
    icon: "online_prediction",
    path: "/oracle"
  },
  {
    title: "Simplified Price Oracles",
    caption: "Simplified example of price data feed from store",
    icon: "book",
    path: "/oraclesimple"
  },
  {
    title: "Oracles Leaderboard",
    caption: "Leaderboards for oracle counts",
    icon: "star",
    path: "/leaderboard"
  },
  {
    title: "Random Number Generator",
    caption: "Request a random number from the RNG oracles",
    icon: "room_preferences",
    path: "/requestrng"
  },{
    title: "Telos Trail",
    caption: "Using RNG oracle to decide your fate!",
    icon: "add_road",
    path: "/telos-trail"
  },
];

const linksData = [
  {
    title: "RNG Consumer Contract",
    caption: "github.com/telosnetwork/rng-consumer",
    icon: "fab fa-github",
    link: "https://github.com/telosnetwork/rng-consumer"
  },
  {
    title: "Telos Oracle RNG",
    caption: "github.com/telosnetwork/telos-oracle-rng",
    icon: "fab fa-github",
    link: "https://github.com/telosnetwork/telos-oracle-rng"
  },
  {
    title: "This oracle dashboard",
    caption: "github.com/telosnetwork/telos-oracle-dashboard",
    icon: "fab fa-github",
    link: "https://github.com/telosnetwork/telos-oracle-dashboard"
  },
];

export default {
  name: "MainLayout",
  components: { EssentialLink, ExamplePage, LoginButton },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      examplePages: pagesData
    };
  }
};
</script>
