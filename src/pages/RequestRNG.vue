<template>
  <q-page class="column justify-center items-center q-px-md">
    <h2>Request a random number</h2>
    <div v-if="isAuthenticated">
      <q-input
        outlined
        bottom-slots
        v-model.number="min"
        type="number"
        label="Min"
      />
      <q-input
        outlined
        bottom-slots
        v-model.number="max"
        type="number"
        label="Max"
      />
      <div>The seed can be anything, we have generated one for you</div>
      <q-input
        outlined
        bottom-slots
        v-model.number="seed"
        type="number"
        label="Seed"
      />
      <q-btn size="xl" round dense flat icon="play_arrow" @click="send" />
      <div v-if="activeRequest">
        <q-card row class="q-px-md">
          <q-card-section>
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <h4 v-if="!isNaN(currentRequest.number)" @click="openTransaction(currentRequest.number_trx_id)">
                Your random number is: {{ currentRequest.number }}
              </h4>
            </transition>
            <q-inner-loading :showing="isNaN(currentRequest.number)">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </q-card-section>
          <q-list>
            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="primary" name="filter_1" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Oracle response #1</q-item-label>
                <q-item-label caption
                  >Signature used for randomness</q-item-label
                >
              </q-item-section>
              <q-item-section v-if="currentRequest.oracles.length > 0" @click="openTransaction(currentRequest.oracles[0].trx_id)">
                <q-item-label>{{
                  currentRequest.oracles[0].name
                }}</q-item-label>
                <q-item-label caption>{{
                  currentRequest.oracles[0].sig
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="accent" name="filter_2" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Oracle response #2</q-item-label>
                <q-item-label caption
                  >Signature used for randomness</q-item-label
                >
              </q-item-section>

              <q-item-section v-if="currentRequest.oracles.length > 1" @click="openTransaction(currentRequest.oracles[0].trx_id)">
                <q-item-label>{{
                  currentRequest.oracles[1].name
                }}</q-item-label>
                <q-item-label caption>{{
                  currentRequest.oracles[1].sig
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="positive" name="filter_3" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Oracle response #3</q-item-label>
                <q-item-label caption
                  >Signature used to determine order to combine 1 &
                  2</q-item-label
                >
              </q-item-section>

              <q-item-section v-if="currentRequest.oracles.length > 2" @click="openTransaction(currentRequest.oracles[0].trx_id)">
                <q-item-label>{{
                  currentRequest.oracles[2].name
                }}</q-item-label>
                <q-item-label :lines="1" caption>{{
                  currentRequest.oracles[2].sig
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <q-dialog v-model="showTransaction" confirm>
        <q-card>
          <q-card-section class="row">
            <q-avatar icon="arrow_forward" color="primary" text-color="white" />
            <span class="q-ml-sm">
              Transaction sent, click to view in block explorer.
            </span>
            <q-item
              clickable
              tag="a"
              target="_blank"
              :href="`${explorerUrl}/transaction/${transaction}`"
              class="q-ml-sm"
              >{{ transaction }}</q-item
            >
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Ok" color="primary" v-close-popup></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <div v-else>Please login to request a random number!</div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const HyperionSocketClient = require("@eosrio/hyperion-stream-client").default;
const fetch = require("node-fetch");

export default {
  data() {
    return {
      min: 0,
      max: 42,
      seed: Math.floor(Math.random() * 10000000) + 1,
      showTransaction: null,
      transaction: null,
      explorerUrl: process.env.NETWORK_EXPLORER,
      consumerContract: process.env.ORACLE_CONSUMER,
      currentRequest: {},
      /*
      currentRequest: {
        request_id: "71",
        min: "0",
        max: "42",
        caller: "rngconsumer1",
        timestamp: "2021-06-19T07:26:12.000",
        caller_id: "0",
        digest:
          "B738FD4AF0905935A4426575C5C4FBBD2FF0BE9A36EAF3909C8B3E4DA1F54904",
        oracle1: "eosio.null",
        sig1:
          "SIG_K1_111111111111111111111111111111111111111111111111111111111111111116uk5ne",
        oracle2: "eosio.null",
        sig2:
          "SIG_K1_111111111111111111111111111111111111111111111111111111111111111116uk5ne",
        request_time: "2021-06-19T07:26:11.000",
        oracles: [
          {
            name: "caleosblocks",
            sig:
              "SIG_K1_KiBCkdDED4F2dKwqPb5h6UCr7vL7AzTtPMRkvP13xZU7aKhn24PMoE3cJj9vaooxyMJffdQNndV2CNhyvdCv3T7aAxiDnw"
          },
          {
            name: "bp.boid",
            sig:
              "SIG_K1_KcsHrpviDracJcyckicagrg8EaNJLBhLSZ7U5fRvp2qVrq9pEzm4YKtpT37zNBVsmKzCbLgvYgQvKUMmRJjHKs9AhKcSDj"
          },
          {
            name: "kainosblkpro",
            sig:
              "SIG_K1_JuUN3JAdtJBCvoodgSxieooTDJ2Jhngj36gzWSRsUWQM6tCw8V9Jzz7KnagrySnS1dxEKysi6tKSjSoapDZAX1dZxbqPkD"
          }
        ],
        number: "30"
      },
      */
      previousRequests: []
    };
  },
  computed: {
    ...mapGetters("account", ["isAuthenticated", "accountName"]),
    activeRequest() {
      return Object.keys(this.currentRequest).length > 0;
    }
  },
  methods: {
    async setupClient() {
      if (this.client) return;

      this.client = new HyperionSocketClient(process.env.HYPERION_ENDPOINT, {
        async: false,
        fetch: fetch
      });

      this.client.onConnect = () => {
        this.client.streamDeltas({
          code: `${this.consumerContract}`,
          table: "rngrequests",
          scope: `${this.consumerContract}`,
          payer: "",
          start_from: 0,
          read_until: 0
        });

        this.client.streamDeltas({
          code: `rng.oracle`,
          table: "rngrequests",
          scope: `rng.oracle`,
          payer: "",
          start_from: 0,
          read_until: 0
        });

        this.client.streamActions({
          contract: `rng.oracle`,
          action: "submitrand",
          account: "",
          start_from: 0,
          read_until: 0,
          filters: []
        });

        this.client.streamActions({
          contract: `${this.consumerContract}`,
          action: "randreceipt",
          account: "",
          start_from: 0,
          read_until: 0,
          filters: []
        });
      };

      this.client.onData = async data => {
        let dataType = data.type;
        if (dataType == "action") {
          if (!this.currentRequest) return;

          let actData = data.content.act.data;
          if (data.content.act.name == "submitrand") {
            this.currentRequest.oracles.push({
              name: actData.oracle_name,
              sig: actData.sig,
              trx_id: data.content.trx_id
            });
          } else {
            this.currentRequest.number_trx_id = data.content.trx_id;
            this.currentRequest.number = actData.number;
          }
        } else if (dataType == "delta") {
          if (data.content.code == `${this.consumerContract}`) {
            if (data.content.present && data.content.data.caller == this.accountName) {
              this.currentRequest = {
                ...data.content.data,
                oracles: [],
                timestamp: data.content["@timestamp"],
                caller_id: data.content.data.request_id
              };
            }
          } else {
            if (
              this.currentRequest &&
              data.content.data.caller == this.consumerContract &&
              data.content.data.caller_id == this.currentRequest.caller_id
            ) {
              Object.assign(this.currentRequest, data.content.data);
            }
          }
        }
      };

      this.client.connect(() => {
        console.log("Connected to Hyperion Stream!");
      });
    },
    async send() {
      if (this.min < 0 || this.min >= this.max) {
        this.$q.notify({
          type: "negative",
          message: `The Min must be less than the Max and Min must be greater than 0`
        });
        return;
      }

      const actions = [
        {
          account: this.consumerContract,
          name: "requestrand",
          data: {
            seed: parseInt(this.seed, 10),
            caller: this.accountName,
            min: parseInt(this.min, 10),
            max: parseInt(this.max, 10)
          }
        }
      ];
      try {
        const transaction = await this.$store.$api.signTransaction(actions);
        if (transaction) {
          this.showTransaction = true;
          this.transaction = transaction.transactionId;
        }
      } catch (e) {
        this.$q.notify({
          type: "negative",
          message: `Error requesting RNG: ${e.message}`
        });
      }
    },
    openTransaction(trxId) {
      window.open(`${this.explorerUrl}/transaction/${trxId}`);
    }
  },
  mounted() {
    this.setupClient();
  },
  destroyed() {
    if (this.client) this.client.disconnect();

    this.client = null;
  }
};
</script>
