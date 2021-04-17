/**
 * MySQL Response Object Builder.
 *
 * @author bombitmanbomb
 * @class MYSQLPromiseObjectBuilder
 */
class MYSQLPromiseObjectBuilder {
	constructor(/**@type {import("mysql").Pool}*/ pool) {
		this.keys = [];
		this.values = [];
		this.pool = pool;
	}
	/**Add a promise to the handler.
	 * @param {string} key Key in the response object
	 * @param {string} query SQL Query
	 * @param {*} def Default Value
	 * @param {string} DBKey Database Key
	 * @memberof MYSQLPromiseObjectBuilder
	 * @returns {true} Done
	 */
	async add(key, query, def = null, DBKey) {
		this.keys.push(key);
		let response = new Promise((res) => {
			this.pool.query(query, (err, result) => {
				// Call from Pool, Auto closes connection
				if (result && result[0] != null) {
					res(DBKey != null ? result[0][DBKey] : result[0]);
				} else {
					res(def);
				}
			});
		});
		this.values.push(response);
		return response;
	}
	/**Build an object based on the responses.
	 * @param {Object} data is data.memberData (the mongoose Member schema)
	 * @returns {Object<*>} Object
	 * @memberof MYSQLPromiseObjectBuilder
	 */
	async waitForAll(data = {}) {
		let values = await Promise.all(this.values);

		for (let i = 0; i < values.length; i++) {
			data[this.keys[i]] = values[i];
		}
		return data;
	}
}
module.exports = MYSQLPromiseObjectBuilder;
