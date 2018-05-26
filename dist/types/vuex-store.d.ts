import Store, { StoreSettings } from '@orbit/store';
import { Module, GetterTree, ActionTree, MutationTree, ModuleTree } from 'vuex';
export default class VuexStore<S, R> extends Store implements Module<S, R> {
    namespaced: boolean;
    state: S | (() => S);
    getters: GetterTree<S, R>;
    actions: ActionTree<S, R>;
    mutations: MutationTree<S>;
    modules: ModuleTree<R>;
    constructor(settings?: StoreSettings);
}
