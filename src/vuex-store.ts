import Store, { StoreSettings } from '@orbit/store';
import { Module, GetterTree, ActionTree, MutationTree, ModuleTree } from 'vuex';
import { Schema, TransformBuilder, RecordIdentity, QueryOrExpression, TransformOrOperations, QueryBuilderFunc } from '@orbit/data';
import { getField, updateField } from 'vuex-map-fields';
import { Record } from '@orbit/data';
export default class VuexStore<S, R> extends Store implements Module<S, R> {
    namespaced: boolean = false;
    state: S | (() => S);
    getters: GetterTree<S, R>;
    actions: ActionTree<S, R>;
    mutations: MutationTree<S>;
    modules: ModuleTree<R>;
    constructor(settings: StoreSettings = {}) {
        super(settings)
        if (settings.schema) {
            //generate vuex store
            this.state = this.state || {} as S;
            Object.keys(this._schema.models).forEach(type => {
                let model = settings.schema.getModel(type);
                this.state = this.state || {} as S;
                //add to state
                //singularized
                this.state[type] = null;
                //and a collection
                this.state[`${type}Collection`] = [];
            });
            //map fields
            this.getters = {
                getField: (state) => {
                    return path => path.split(/[.[\]]+/).reduce((prev, key) =>{
                        if(prev!=null) {
                            return prev[key]
                        } else {
                            return null;
                        }
                    }, state);
                }
            };
            this.actions = {
                //TODO: Add fetch settings like json api
                create: ({ commit, dispatch }, record: Record) => {
                    this.update((t) => t.addRecord(record)).then((data) => {
                       // dispatch("fetchAllOf", record.type);
                        commit("set", { data: record, model: record.type });
                        //TODO: relationships 
                    });
                },
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: ({ commit }, model: string) => {
                    this.query(q => q.findRecords(model)).then((data) => {
                        commit('set', { data, model: `${model}Collection` })
                    })
                },
                fetchAllRelatedOf: ({ commit }, query: { data: RecordIdentity, relationship: string }) => {
                    this.query(q => q.findRelatedRecords(query.data, query.relationship)).then((data) => {
                        commit('set', { data, model: query.relationship })//mind that this is the pluralized version
                    })
                },
                fetchRelatedOf: ({ commit }, query: { data: RecordIdentity, relationship: string }) => {
                    this.query(q => q.findRelatedRecord(query.data, query.relationship)).then((data) => {
                        commit('set', { data, model: query.relationship })//singularized version
                    })
                },
                fetchOne: ({ commit }, { model, id }) => {
                    this.query(q => q.findRecord({ type: model, id })).then((data) => commit('set', { data, model: model }))
                },
                update: ({ commit }, data: Record) => {
                    this.update((t) => t.updateRecord(data)).then(() =>
                        commit('set', { data, model: data.type })
                    )
                },
                delete: ({ commit, dispatch }, data: Record) => {
                    this.update((t) => t.removeRecord(data)).then(() => {
                        //update
                        dispatch("fetchAllOf", data.type);
                    })
                },
                updating:(store,options:{transformOrOperations:TransformOrOperations,thenable:Function})=>{
                    this.update(options.transformOrOperations).then((data)=>{
                        options.thenable(store,data);
                    })
                },
                querying: (store, options:{queryOrExpression: QueryBuilderFunc,thenable:Function}) => {
                    this.query(q=>{
                        return options.queryOrExpression(q)}).then((data) => {
                        options.thenable(store,data);
                    })
                }
                //TODO: RelatedRecords update and delete
            }
            this.mutations = {
                remove: (state,{ data, model}) => {
                    if (model.lastIndexOf('s') !== model.length - 1) {
                        let index= state[model+'s'].findIndex((record:Record) => record.id ==data.id)
                        state[model+'s'].splice(index,1)
                    } else {
                        let index= state[model+'s'].findIndex((record:Record) => record.id ==data.id)
                        state[model+'s'].splice(index,1)
                    }
                },
                set: (state, { data, model }) => {
                    state[model] = data;
                    if (model.endsWith("Collection")) {
                        //update also in Collection
                        let setted = false
                        state[`${model}Collection`].forEach((item: Record) => {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                                setted = true
                            }
                        })
                        if(!setted){
                            state[`${model}Collection`].push(data)
                        }
                    } else {
                        //splice data in oder to achieve updates
                        state[model] = [];
                        state[model] = data;
                        state[model].splice(data.length)
                    }
                },
                updateField: (state, { path, value }) => {
                    //set in field
                    path.split(/[.[\]]+/).reduce((prev, key, index, array) => {
                        if (array.length === index + 1) {
                            // eslint-disable-next-line no-param-reassign
                            prev[key] = value;
                        }

                        return prev[key];
                    }, state);
                }
            };
        }
    }
}