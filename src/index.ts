import { Service } from 'ck-ms-di';
import { Keyv, KeyvOptions } from 'keyv';

@Service({ lifecycle: 'singleton' })
export class CacheService {
    private _namespaces: Map<string, Keyv> = new Map<string, Keyv>();

    public async init() {
        this._createDevaultNamespace();
    }

    private _createDevaultNamespace() {
        const keyv = new Keyv();
        this._namespaces.set('default', keyv);
    }

    public createNamespace(namespace: string, options?: KeyvOptions) {
        if (this._namespaces.has(namespace)) {
            throw new Error(`Namespace ${namespace} already exists`);
        }

        const keyv = new Keyv(options);
        this._namespaces.set(namespace, keyv);
    }

    public hasNamespace(namespace: string) {
        return this._namespaces.has(namespace);
    }

    public on(namespace: string, event: string, listener: (...args: any[]) => void) {
        if (!this._namespaces.has(namespace)) {
            throw new Error(`Namespace ${namespace} does not exist`);
        }

        this._namespaces.get(namespace)?.on(event, listener);
    }

    public async set(namespace: string, key: string, value: any, ttl?: number) {
        if (!this._namespaces.has(namespace)) {
            throw new Error(`Namespace ${namespace} does not exist`);
        }

        return this._namespaces.get(namespace)?.set(key, value, ttl);
    }

    public async get(namespace: string, key: string) {
        if (!this._namespaces.has(namespace)) {
            throw new Error(`Namespace ${namespace} does not exist`);
        }

        return this._namespaces.get(namespace)?.get(key);
    }

    public async delete(namespace: string, key: string) {
        if (!this._namespaces.has(namespace)) {
            throw new Error(`Namespace ${namespace} does not exist`);
        }

        return this._namespaces.get(namespace)?.delete(key);
    }

    public async clear(namespace: string) {
        if (!this._namespaces.has(namespace)) {
            throw new Error(`Namespace ${namespace} does not exist`);
        }

        return this._namespaces.get(namespace)?.clear();
    }

    public async clearAll() {
        for (const keyv of this._namespaces.values()) {
            await keyv.clear();
        }
    }

    public emitEvent(namespace: string, event: string) {
        if (!this._namespaces.has(namespace)) {
            throw new Error(`Namespace ${namespace} does not exist`);
        }

        this._namespaces.get(namespace)?.emit(event);
    }
}
