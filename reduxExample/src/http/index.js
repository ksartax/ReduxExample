import { generate as id } from 'shortid';

export const get = (url, cb) => {
    setTimeout(() => {
        cb(id());
    }, 500);
}