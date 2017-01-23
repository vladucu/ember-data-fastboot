export function initialize(applicationInstance) {
  let store = applicationInstance.lookup('service:store');
  let shoebox = applicationInstance.lookup('service:fastboot').get('shoebox');
  const modelNames = applicationInstance.lookup('data-adapter:main').getModelTypes().mapBy('name');

  shoebox.put('ember-data-store', {
    get records() {
      let serializedRecords = {};

      return modelNames.map(name => {
        serializedRecords[name] = [];
        return store.peekAll(name).toArray();
      }).reduce((a,b) => a.concat(b), [])
        .filter(model => model.get('isLoaded'))
        .forEach(model => {
          let modelName = model._internalModel.modelName;
          let serialized = model.serialize({ includeId: true });

          if (Object.keys(serialized).includes('data')) {
            if (serializedRecords[modelName].length === 0) {
              serializedRecords[modelName] = { data: [] };
            }

            serializedRecords[modelName]['data'].push(serialized.data);
          } else {
            serializedRecords[modelName].push(serialized);
          }
        });

      return serializedRecords;
    }
  });
}

export default {
  name: 'ember-data-fastboot',
  initialize
};
