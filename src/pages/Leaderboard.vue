<template>
  <q-page class="column justify-center items-center">
      <div class="text-h4">
          Live Streaming Example
      </div>
      <div style="text-align: center">
        This is the "cpu" action on the "eosmechanics" contract,<br> which benchmarks CPU performance of active BPs
      </div>
      <q-markup-table flat bordered>
        <thead class="background: primary">
          <tr>
            <th class="text-right">Timestamp</th>
            <th class="text-right">Oracle</th>
            <th class="text-right">Update Count</th>
            <th class="text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rngFeed in $store.state.oracles.rngFeeds" :key="rngFeed.global_sequence">
            <td class="text-right">
              {{
                moment
                  .utc(rngFeed['@timestamp'])
                  .local()
                  .format("dddd, MMMM Do YYYY, h:mm:ss a")
              }}
            </td>
            <td class="text-right">{{ rngFeed.owner }}</td>
            <td class="text-right">
              {{ rngFeed.count }}
            </td>
            <td class="text-right">
              {{ rngFeed.balance }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
  </q-page>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  mounted: function() {
  },
  destroyed() {
  }
};

</script>
