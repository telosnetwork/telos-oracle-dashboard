
export const updatePriceFeeds = async function({ dispatch, commit }, pFeeds) {
      commit("updatePriceFeeds", pFeeds);
};

export const loadLeaderboards = async function({ dispatch, commit }, pFeeds) {
      const oracleResult = await this.$api.getTableRows({
            code: "rng.oracle",
            scope: "rng.oracle",
            table: "oracles",
          });

      let currentLeaderboard = this.state.oracles.leaderboard;
      oracleResult.rows.forEach(row => {
            if (!currentLeaderboard.hasOwnProperty(row.oracle_name)) {
                  currentLeaderboard[row.oracle_name] = {};
            }

            let oracleRow = currentLeaderboard[row.oracle_name];
            oracleRow.rng_count = row.sigcount;
      })

      const priceResult = await this.$api.getTableRows({
            code: "delphioracle",
            scope: "delphioracle",
            table: "stats",
          });

      priceResult.rows.forEach(row => {
            if (!currentLeaderboard.hasOwnProperty(row.owner)) {
                  currentLeaderboard[row.owner] = {};
            }

            let oracleRow = currentLeaderboard[row.owner];
            oracleRow.price_count = row.count;
            oracleRow.last_price_feed = row.timestamp;
      })


      commit("setLeaderboard", currentLeaderboard);
};

export const updateRNGFeeds = async function({ dispatch, commit }, nRNG) {

  commit("updateRNGFeeds", nRNG);
};
