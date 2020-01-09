import Vue from 'vue';
import Vuex from 'vuex';

import plugin from './modules/plugin';

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
    modules: {
        plugin,
    },
});

export default vuexStore;
