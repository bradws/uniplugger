import { IDatastore } from '../iDatastore';
import { TestConstants } from '../test-constants';

export default class MyDatastore implements IDatastore {
    
    public name: string = TestConstants.PluginName1;
    
}
