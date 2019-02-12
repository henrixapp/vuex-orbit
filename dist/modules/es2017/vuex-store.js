import Store from '@orbit/store';
export default class VuexStore extends Store {
    constructor(settings = {}) {
        super(settings);
        this.namespaced = false;
        if (settings.schema) {
            //generate vuex store
            this.state = this.state || {};
            Object.keys(this._schema.models).forEach(type => {
                let model = settings.schema.getModel(type);
                this.state = this.state || {};
                //add to state
                //singularized
                this.state[type] = null;
                //and a collection
                this.state[`${type}Collection`] = [];
            });
            //map fields
            this.getters = {
                getField: state => {
                    return path => path.split(/[.[\]]+/).reduce((prev, key) => {
                        if (prev != null) {
                            return prev[key];
                        } else {
                            return null;
                        }
                    }, state);
                }
            };
            this.actions = {
                //TODO: Add fetch settings like json api
                create: async ({ commit }, record) => {
                    let data = await this.update(t => t.addRecord(record));
                    commit("set", { data, model: data.type });
                },
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: async ({ commit }, model) => {
                    let data = await this.query(q => q.findRecords(model));
                    commit('set', { data, model: `${model}Collection` });
                },
                fetchAllRelatedOf: ({ commit }, query) => {
                    this.query(q => q.findRelatedRecords(query.data, query.relationship)).then(data => {
                        commit('set', { data, model: `${this.schema.singularize(query.relationship)}Collection` }); //mind that this is the pluralized version
                    });
                },
                fetchRelatedOf: ({ commit }, query) => {
                    this.query(q => q.findRelatedRecord(query.data, query.relationship)).then(data => {
                        commit('set', { data, model: query.relationship }); //singularized version
                    });
                },
                fetchOne: ({ commit }, { model, id }) => {
                    this.query(q => q.findRecord({ type: model, id })).then(data => commit('set', { data, model: model }));
                },
                update: async ({ commit }, record) => {
                    let data = await this.update(t => t.updateRecord(record));
                    commit('set', { data, model: data.type });
                },
                delete: async ({ commit, dispatch }, data) => {
                    await this.update(t => t.removeRecord(data));
                    await dispatch("fetchAllOf", data.type);
                    commit('set', { data: null, model: data.type });
                },
                updating: (store, options) => {
                    this.update(options.transformOrOperations).then(data => {
                        options.thenable(store, data);
                    });
                },
                querying: (store, options) => {
                    this.query(q => {
                        return options.queryOrExpression(q);
                    }).then(data => {
                        options.thenable(store, data);
                    });
                }
                //TODO: RelatedRecords update and delete
            };
            this.mutations = {
                set: (state, { data, model }) => {
                    state[model] = data;
                    if (data === null) {
                        return;
                    }
                    if (!model.endsWith("Collection")) {
                        //update also in Collection
                        let setted = false;
                        state[`${model}Collection`].forEach(item => {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                                setted = true;
                            }
                        });
                        if (!setted) {
                            state[`${model}Collection`].push(data);
                        }
                    } else {
                        //splice data in oder to achieve updates
                        state[model] = [];
                        state[model] = data;
                        state[model].splice(data.length);
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