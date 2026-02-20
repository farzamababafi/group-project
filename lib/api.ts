import api from '@/lib/axios';

import {helloworld} from './types';

export const hello = async(): Promise<helloworld> =>{
    const response = await api.get<helloworld>('/api/hellow');
    return response.data
}