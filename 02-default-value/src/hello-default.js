import { m } from './paraglide/messages.js';

export const hello = ({ text = m.hello_world() } = {}) => text;
