import { CacheService } from '../src/index';

describe('CacheService', () => {
    describe('Without service container', () => {
        it('should create a default namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            expect(cacheService.hasNamespace('default')).toBeTruthy();
        });

        it('should create a custom namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            cacheService.createNamespace('custom');
            expect(cacheService.hasNamespace('custom')).toBeTruthy();
        });

        it('should throw an error when creating an existing namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            cacheService.createNamespace('custom');
            expect(() => cacheService.createNamespace('custom')).toThrowError();
        });

        it('should throw an error when getting a non-existing namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            await expect(cacheService.get('non-existing', 'key')).rejects.toThrow('Namespace non-existing does not exist');
        });

        it('should throw an error when setting a key in a non-existing namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            await expect(cacheService.set('non-existing', 'key', 'value')).rejects.toThrow('Namespace non-existing does not exist');
        });

        it('should throw an error when getting a key in a non-existing namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            await expect(cacheService.get('non-existing', 'key')).rejects.toThrow('Namespace non-existing does not exist');
        });

        it('should throw an error when deleting a key in a non-existing namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            await expect(cacheService.delete('non-existing', 'key')).rejects.toThrow('Namespace non-existing does not exist');
        });

        it('should throw an error when clearing a non-existing namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            await expect(cacheService.clear('non-existing')).rejects.toThrow('Namespace non-existing does not exist');
        });

        it('should set and get a key in the default namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            await cacheService.set('default', 'key', 'value');
            expect(await cacheService.get('default', 'key')).toBe('value');
        });

        it('should set and get a key in a custom namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            cacheService.createNamespace('custom');
            await cacheService.set('custom', 'key', 'value');
            expect(await cacheService.get('custom', 'key')).toBe('value');
        });

        it('should delete a key in the default namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            await cacheService.set('default', 'key', 'value');
            await cacheService.delete('default', 'key');
            expect(await cacheService.get('default', 'key')).toBeUndefined();
        });

        it('should delete a key in a custom namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            cacheService.createNamespace('custom');
            await cacheService.set('custom', 'key', 'value');
            await cacheService.delete('custom', 'key');
            expect(await cacheService.get('custom', 'key')).toBeUndefined();
        });

        it('should clear the default namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            await cacheService.set('default', 'key', 'value');
            await cacheService.clear('default');
            expect(await cacheService.get('default', 'key')).toBeUndefined();
        });

        it('should clear a custom namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            cacheService.createNamespace('custom');
            await cacheService.set('custom', 'key', 'value');
            await cacheService.clear('custom');
            expect(await cacheService.get('custom', 'key')).toBeUndefined();
        });

        it('should listen to an event in a namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            cacheService.createNamespace('custom');
            const listener = jest.fn();
            cacheService.on('custom', 'event', listener);
            cacheService.emitEvent('custom', 'event');
            expect(listener).toHaveBeenCalled();
        });

        it('should throw an error when listening to an event in a non-existing namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            const listener = jest.fn();
            expect(() => cacheService.on('non-existing', 'event', listener)).toThrow('Namespace non-existing does not exist');
        });

        it('should throw an error when emitting an event in a non-existing namespace', async () => {
            const cacheService = new CacheService();
            await cacheService.init();
            expect(() => cacheService.emitEvent('non-existing', 'event')).toThrow('Namespace non-existing does not exist');
        });
    });
});
