// src/game/ResourceManager.ts

export class ResourceManager {
  private static instance: ResourceManager;
  private images: Map<string, HTMLImageElement> = new Map();
  private totalAssets: number = 0;
  private loadedAssets: number = 0;

  private constructor() {}

  public static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  // 取得已載入的圖片
  public getImage(key: string): HTMLImageElement | undefined {
    return this.images.get(key);
  }

  // 核心載入邏輯
  public async loadAssets(assetList: { key: string; src: string }[], onProgress?: (progress: number) => void): Promise<void> {
    this.totalAssets = assetList.length;
    this.loadedAssets = 0;

    if (this.totalAssets === 0) {
        if (onProgress) onProgress(100);
        return;
    }

    const promises = assetList.map((asset) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = asset.src;
        img.onload = () => {
          this.images.set(asset.key, img);
          this.loadedAssets++;
          if (onProgress) {
            onProgress(Math.floor((this.loadedAssets / this.totalAssets) * 100));
          }
          resolve();
        };
        img.onerror = () => {
            console.error(`無法載入資源: ${asset.src}`);
            // Resolve anyway to not block the game, maybe set a fallback or just ignore
            this.loadedAssets++;
            if (onProgress) {
                onProgress(Math.floor((this.loadedAssets / this.totalAssets) * 100));
            }
            resolve();
        };
      });
    });

    await Promise.all(promises);
  }
}
