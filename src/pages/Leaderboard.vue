<template>
  <q-page class="column justify-center items-center">
    <div class="text-h4">
      Top Oracles
    </div>
    <div style="text-align: center">
      These are the oracles who have contributed the most data
    </div>
    <q-table
      title="Oracles"
      :data="leaders"
      :columns="columns"
      row-key="oracle"
      @row-click="rowClick"
      :pagination="{rowsPerPage: 10}"
    >
    </q-table>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      columns: [
        {
          name: "oracle",
          required: true,
          label: "Oracle",
          align: "left",
          field: "oracle",
          sortable: true
        },
        {
          name: "rng_count",
          label: "RNG Count",
          field: "rng_count",
          sortable: true
        },
        {
          name: "price_count",
          label: "Price count",
          field: "price_count",
          sortable: true
        }
      ],
    };
  },
  methods: {
    rowClick(evt, row) {
      window.open(`${process.env.NETWORK_EXPLORER}/account/${row.oracle}`);
    }
  },
  computed: {
    ...mapGetters("oracles", ["leaders"])
  },
  mounted: function() {
  },
  destroyed() {}
};
</script>
