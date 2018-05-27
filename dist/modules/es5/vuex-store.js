function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import Store from '@orbit/store';

var VuexStore = function (_Store) {
    _inherits(VuexStore, _Store);

    function VuexStore() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, VuexStore);

        var _this = _possibleConstructorReturn(this, _Store.call(this, settings));

        _this.namespaced = false;
        if (settings.schema) {
            //generate vuex store
            _this.state = _this.state || {};
            Object.keys(_this._schema.models).forEach(function (type) {
                var model = settings.schema.getModel(type);
                _this.state = _this.state || {};
                //add to state
                _this.state[_this._schema.singularize(type)] = model;
                _this.state[_this._schema.pluralize(type)] = [];
            });
            //map fields
            _this.getters = {
                getField: function (state) {
                    return function (path) {
                        return path.split(/[.[\]]+/).reduce(function (prev, key) {
                            return prev[key];
                        }, state);
                    };
                }
            };
            _this.actions = {
                //TODO: Add fetch settings like json api
                create: function (_ref, record) {
                    var commit = _ref.commit,
                        dispatch = _ref.dispatch;

                    _this.update(function (t) {
                        return t.addRecord(record);
                    }).then(function (data) {
                        dispatch("fetchAllOf", record.type);
                        commit("set", { data: data, model: _this._schema.singularize(data.type) });
                        //TODO: relationships
                    });
                },
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: function (_ref2, model) {
                    var commit = _ref2.commit;

                    _this.query(function (q) {
                        return q.findRecords(model);
                    }).then(function (data) {
                        commit('set', { data: data, model: _this._schema.pluralize(model) });
                    });
                },
                fetchAllRelatedOf: function (_ref3, query) {
                    var commit = _ref3.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecords(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchRelatedOf: function (_ref4, query) {
                    var commit = _ref4.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecord(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchOne: function (_ref5, _ref6) {
                    var commit = _ref5.commit;
                    var model = _ref6.model,
                        id = _ref6.id;

                    _this.query(function (q) {
                        return q.findRecord({ type: model, id: id });
                    }).then(function (data) {
                        return commit('set', { data: data, model: _this._schema.singularize(model) });
                    });
                },
                update: function (_ref7, data) {
                    var commit = _ref7.commit;

                    _this.update(function (t) {
                        return t.replaceRecord(data);
                    }).then(function () {
                        return commit('set', { data: data, model: data.type });
                    });
                },
                delete: function (_ref8, data) {
                    var commit = _ref8.commit,
                        dispatch = _ref8.dispatch;

                    _this.update(function (t) {
                        return t.removeRecord(data);
                    }).then(function () {
                        //update
                        dispatch("fetchAllOf", data.type);
                    });
                }
                //TODO: RelatedRecords update and delete
            };
            _this.mutations = {
                set: function (state, _ref9) {
                    var data = _ref9.data,
                        model = _ref9.model;

                    state[model] = data;
                    if (model.lastIndexOf('s') !== model.length - 1) {
                        state[_this.schema.pluralize(model)].forEach(function (item) {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                            }
                        });
                    }
                },
                updateField: function (state, _ref10) {
                    var path = _ref10.path,
                        value = _ref10.value;

                    //set in field
                    path.split(/[.[\]]+/).reduce(function (prev, key, index, array) {
                        if (array.length === index + 1) {
                            // eslint-disable-next-line no-param-reassign
                            prev[key] = value;
                        }
                        return prev[key];
                    }, state);
                }
            };
        }
        return _this;
    }

    return VuexStore;
}(Store);

export default VuexStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwic2luZ3VsYXJpemUiLCJwbHVyYWxpemUiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJwYXRoIiwic3BsaXQiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiYWN0aW9ucyIsImNyZWF0ZSIsInJlY29yZCIsImNvbW1pdCIsImRpc3BhdGNoIiwidXBkYXRlIiwidCIsImFkZFJlY29yZCIsInRoZW4iLCJkYXRhIiwiZmV0Y2hBbGxPZiIsInF1ZXJ5IiwicSIsImZpbmRSZWNvcmRzIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJmZXRjaFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZmV0Y2hPbmUiLCJpZCIsImZpbmRSZWNvcmQiLCJyZXBsYWNlUmVjb3JkIiwiZGVsZXRlIiwicmVtb3ZlUmVjb3JkIiwibXV0YXRpb25zIiwic2V0IiwibGFzdEluZGV4T2YiLCJsZW5ndGgiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJ1cGRhdGVGaWVsZCIsInZhbHVlIiwiaW5kZXgiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLE1BQWtCLGNBQWxCOztJQUNxQkMsUzs7O0FBQ2pCLHlCQUEyQjtBQUFBLFlBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSxxREFDdkIsa0JBQU1BLFFBQU4sQ0FEdUI7O0FBRXZCLGNBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxZQUFJRCxTQUFTRSxNQUFiLEVBQXFCO0FBQ2pCO0FBQ0Esa0JBQUtDLEtBQUwsR0FBYSxNQUFLQSxL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OiJ2dWV4LXN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW3RoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZSh0eXBlKV0gPSBtb2RlbDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW3RoaXMuX3NjaGVtYS5wbHVyYWxpemUodHlwZSldID0gW107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vbWFwIGZpZWxkc1xuICAgICAgICAgICAgdGhpcy5nZXR0ZXJzID0ge1xuICAgICAgICAgICAgICAgIGdldEZpZWxkOiBzdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXRoID0+IHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXkpID0+IHByZXZba2V5XSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBBZGQgZmV0Y2ggc2V0dGluZ3MgbGlrZSBqc29uIGFwaVxuICAgICAgICAgICAgICAgIGNyZWF0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LmFkZFJlY29yZChyZWNvcmQpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goXCJmZXRjaEFsbE9mXCIsIHJlY29yZC50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdChcInNldFwiLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUoZGF0YS50eXBlKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogcmVsYXRpb25zaGlwc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBhcmd1bWVudCBtb2RlbDogVGhlIG1vZGVsIGFzIHNpbmd1bGFyaXplZCBuYW1lXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxPZjogKHsgY29tbWl0IH0sIG1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmRzKG1vZGVsKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZHMocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmQocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoT25lOiAoeyBjb21taXQgfSwgeyBtb2RlbCwgaWQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3JkKHsgdHlwZTogbW9kZWwsIGlkIH0pKS50aGVuKGRhdGEgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUobW9kZWwpIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogKHsgY29tbWl0IH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnJlcGxhY2VSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBkYXRhLnR5cGUgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVsZXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnJlbW92ZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3VwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goXCJmZXRjaEFsbE9mXCIsIGRhdGEudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL1RPRE86IFJlbGF0ZWRSZWNvcmRzIHVwZGF0ZSBhbmQgZGVsZXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==