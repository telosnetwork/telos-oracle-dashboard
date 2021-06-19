
export const updatePriceFeeds = async function({ dispatch, commit }, pFeeds) {

      commit("updatePriceFeeds", pFeeds);
};

export const updateRNGFeeds = async function({ dispatch, commit }, nRNG) {

      commit("updateRNGFeeds", nRNG);
};