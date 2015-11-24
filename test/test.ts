import * as mocha from 'mocha';
import * as assert from 'assert';
import * as Utils from './../lib/utils';

console.log('begin testing:');

describe('Utils test:', function() {
	
	let array = [1, 2, 3],
	object = { 'a': 1, 'b': 2, 'c': 3 },
	object2 = Object.create(object, {
		'd': {
			value: 42
		}
	});
				
	describe('#keys:', function() {
		it('it should console log keys of the project:', function() {
			console.log(Utils.keys(array), "['0', '1', '2']");
			console.log(Utils.keys(object), "['a', 'b', 'c']");
			console.log(Utils.keys(object2), "[]");
		});
	});
	
	describe('#each:', function() {
		it('it should console the same value:', function(done) {
			console.log('array:', array);
			console.log('isArrayLike(array):', Utils.isArrayLike(array));
			Utils.each(array, (item, index) => {
				console.log('index ' + index + ': ' + array[<any>index] + ' = ' + item);
			});
			
			console.log('object:', object);
			console.log('isArrayLike(object):', Utils.isArrayLike(object));
			Utils.each(object, (item, index) => {
				console.log('object ' + index + ': ' + (<any>object)[index] + ' = ' + item);
			});
			done();
		});
	});
	
	describe('#map', function() {
		it('it should console log the same value:', function(done) {
			console.log('isArrayLike(array):', Utils.isArrayLike(array));
			Utils.map(array, (item, index) => {
				console.log('index ' + index + ': ' + array[<number>index] + ' = ' + item);
			});
			
			console.log('object:', object);
			Utils.map(object, (value, key) => {
				console.log('key:', key);
				console.log('object ' + (<any>object)[key] + ' = ' + value);
			});
		})
	});
	
});



