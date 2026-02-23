import { ResourceManager } from './ResourceManager';
import { Entity } from './classes/Entity';
import { Particle } from './classes/Particle';
import { Projectile } from './classes/Projectile';

export const IsoUtils = {
  TILE_WIDTH: 64,
  TILE_HEIGHT: 32,
  WORLD_SCALE: 40, // 1 Tile = 40 World Units (pixels in logic)

  // Map Grid (Tile) to Screen Pixels
  mapToScreen(mapX: number, mapY: number) {
    const screenX = (mapX - mapY) * (this.TILE_WIDTH / 2);
    const screenY = (mapX + mapY) * (this.TILE_HEIGHT / 2);
    return { x: screenX, y: screenY };
  },

  // Screen Pixels to Map Grid (Tile)
  screenToMap(screenX: number, screenY: number) {
    const halfW = this.TILE_WIDTH / 2;
    const halfH = this.TILE_HEIGHT / 2;
    const mapX = (screenX / halfW + screenY / halfH) / 2;
    const mapY = (screenY / halfH - screenX / halfW) / 2;
    return { x: mapX, y: mapY };
  },

  // World Logic Coords (x,y) to Screen Pixels
  worldToScreen(wx: number, wy: number) {
    const mapX = wx / this.WORLD_SCALE;
    const mapY = wy / this.WORLD_SCALE;
    return this.mapToScreen(mapX, mapY);
  },

  // Screen Pixels to World Logic Coords (x,y)
  screenToWorld(sx: number, sy: number) {
    const mapPos = this.screenToMap(sx, sy);
    return {
        x: mapPos.x * this.WORLD_SCALE,
        y: mapPos.y * this.WORLD_SCALE
    };
  }
};

export class IsometricMapManager {
    private static instance: IsometricMapManager;
    
    private constructor() {}

    public static getInstance(): IsometricMapManager {
        if (!IsometricMapManager.instance) {
            IsometricMapManager.instance = new IsometricMapManager();
        }
        return IsometricMapManager.instance;
    }

    public renderScene(
        ctx: CanvasRenderingContext2D, 
        camera: {x: number, y: number}, 
        entities: Entity[], 
        projectiles: Projectile[],
        particles: Particle[],
        floatingTexts: any[],
        width: number, 
        height: number
    ) {
        const centerScreenX = width / 2;
        const centerScreenY = height / 2;
        
        // Calculate Camera Offset
        const camScreen = IsoUtils.worldToScreen(camera.x, camera.y);
        const offsetX = centerScreenX - camScreen.x;
        const offsetY = centerScreenY - camScreen.y;
        
        // --- 1. Draw Ground (Culling Implemented) ---
        ctx.save();
        ctx.translate(offsetX, offsetY);
        
        // Calculate visible bounds
        const padding = 2;
        const topLeft = IsoUtils.screenToMap(camScreen.x - width / 2, camScreen.y - height / 2);
        const topRight = IsoUtils.screenToMap(camScreen.x + width / 2, camScreen.y - height / 2);
        const bottomLeft = IsoUtils.screenToMap(camScreen.x - width / 2, camScreen.y + height / 2);
        const bottomRight = IsoUtils.screenToMap(camScreen.x + width / 2, camScreen.y + height / 2);

        const minX = Math.floor(Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x)) - padding;
        const maxX = Math.ceil(Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x)) + padding;
        const minY = Math.floor(Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y)) - padding;
        const maxY = Math.ceil(Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y)) + padding;
        
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                // Limit to reasonable map size if needed, e.g., -50 to 50
                if (x >= -50 && x <= 50 && y >= -50 && y <= 50) {
                    this.drawTile(ctx, x, y);
                }
            }
        }

        // --- 2. Depth Sorting & Entity Rendering ---
        const renderList: {y: number, draw: () => void}[] = [];

        // Entities
        entities.forEach(entity => {
            renderList.push({
                y: entity.position.y,
                draw: () => this.drawIsoEntity(ctx, entity)
            });
        });

        // Sort by Y (World Y)
        renderList.sort((a, b) => a.y - b.y);

        // Draw Sorted Entities
        renderList.forEach(item => item.draw());

        // Draw Projectiles
        projectiles.forEach(p => this.drawIsoProjectile(ctx, p));

        // Draw Particles
        particles.forEach(p => this.drawIsoParticle(ctx, p));

        // Draw Floating Texts
        floatingTexts.forEach(ft => this.drawIsoFloatingText(ctx, ft));
        
        ctx.restore();

        // --- 3. Ambient Lighting (Screen Space) ---
        this.drawAmbientLighting(ctx, width, height);
    }
    
    private drawAmbientLighting(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.save();
        // Radial gradient centered on screen (since player is centered)
        const centerX = width / 2;
        const centerY = height / 2;
        const gradient = ctx.createRadialGradient(centerX, centerY, 100, centerX, centerY, 500);
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.6, 'rgba(34, 16, 18, 0.3)'); // Reddish tint
        gradient.addColorStop(1, 'rgba(10, 5, 5, 0.85)');    // Dark vignette

        ctx.fillStyle = gradient;
        // 'multiply' or 'source-over' depending on desired effect. 
        // multiply darkens, but can be too dark if background is dark.
        // Let's use normal blending for the vignette overlay.
        ctx.globalCompositeOperation = 'source-over'; 
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }
    
    private drawTile(ctx: CanvasRenderingContext2D, mapX: number, mapY: number) {
        const pos = IsoUtils.mapToScreen(mapX, mapY);
        const w = IsoUtils.TILE_WIDTH;
        const h = IsoUtils.TILE_HEIGHT;
        
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - h/2);
        ctx.lineTo(pos.x + w/2, pos.y);
        ctx.lineTo(pos.x, pos.y + h/2);
        ctx.lineTo(pos.x - w/2, pos.y);
        ctx.closePath();
        
        // Checkerboard pattern for visibility
        // Village area check (approximate radius 400 world units -> 10 tiles)
        const dist = Math.hypot(mapX, mapY);
        const isVillage = dist < 10;

        if (isVillage) {
             ctx.fillStyle = (Math.floor(mapX) + Math.floor(mapY)) % 2 === 0 ? '#2f855a' : '#276749'; // Greenish
        } else {
             ctx.fillStyle = (Math.floor(mapX) + Math.floor(mapY)) % 2 === 0 ? '#2d3748' : '#1a202c'; // Dark
        }
        
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
    
    private drawIsoEntity(ctx: CanvasRenderingContext2D, entity: Entity) {
        const screenPos = IsoUtils.worldToScreen(entity.position.x, entity.position.y);
        const x = screenPos.x;
        const y = screenPos.y;

        // Animation Vars
        const now = Date.now();
        const breathScale = 1 + Math.sin(now * 0.003) * 0.02; // Breathing
        const walkWobble = entity.isMoving ? Math.sin(now * 0.015) * 0.1 : 0; // Wobble (radians)

        // Dynamic Shadow
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1 + (breathScale - 1) * 0.5, 1); // Shadow grows slightly with breath
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Sprite / Body
        const sprite = entity.spriteKey ? ResourceManager.getInstance().getImage(entity.spriteKey) : undefined;
        
        ctx.save();
        ctx.translate(x, y);
        
        // Apply Animation Transforms
        ctx.rotate(walkWobble);
        ctx.scale(1, breathScale);

        if (sprite) {
            const size = 80; // Sprite size
            // Draw centered horizontally, bottom aligned to y (feet at 0,0 local)
            // Adjust y offset to make feet touch the shadow center
            ctx.drawImage(sprite, -size/2, -size + 10, size, size);
        } else {
            // Fallback Circle
            ctx.fillStyle = entity.color;
            ctx.beginPath();
            ctx.arc(0, -20, 15, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        
        // HP Bar (Floating above, not affected by rotation/scale of body)
        const hpPercent = entity.stats.hp / entity.stats.maxHp;
        const barW = 40;
        const barH = 5;
        const barY = y - 75; // Higher up
        
        ctx.fillStyle = '#111';
        ctx.fillRect(x - barW/2, barY, barW, barH);
        ctx.fillStyle = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.2 ? '#eab308' : '#ef4444';
        ctx.fillRect(x - barW/2, barY, barW * hpPercent, barH);
        
        // Border for HP bar
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - barW/2, barY, barW, barH);
    }

    private drawIsoProjectile(ctx: CanvasRenderingContext2D, p: Projectile) {
        const screenPos = IsoUtils.worldToScreen(p.x, p.y);
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y - 20, p.radius, 0, Math.PI * 2); // Lifted slightly
        ctx.fill();
        
        // Trail
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        // Simple trail logic: just a smaller circle behind? 
        // Real trail requires history. For now just glow.
        ctx.arc(screenPos.x, screenPos.y - 20, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    private drawIsoParticle(ctx: CanvasRenderingContext2D, p: Particle) {
        const screenPos = IsoUtils.worldToScreen(p.x, p.y);
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y - 20, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    private drawIsoFloatingText(ctx: CanvasRenderingContext2D, ft: any) {
        const screenPos = IsoUtils.worldToScreen(ft.x, ft.y);
        
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.globalAlpha = Math.max(0, ft.life / 1000);
        ctx.fillText(ft.text, screenPos.x, screenPos.y - 40); // Float higher
        ctx.globalAlpha = 1.0;
    }

    public drawHighlight(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, camera: {x: number, y: number}, width: number, height: number) {
        // Convert Mouse Screen Pos -> World Pos -> Map Grid
        // But wait, mouseX/Y passed here are usually relative to canvas top-left.
        // We need to account for the camera translation we did in renderScene.
        
        const centerScreenX = width / 2;
        const centerScreenY = height / 2;
        const camScreen = IsoUtils.worldToScreen(camera.x, camera.y);
        const offsetX = centerScreenX - camScreen.x;
        const offsetY = centerScreenY - camScreen.y;
        
        // Mouse in "World Screen Space" (after untranslating camera)
        const worldScreenX = mouseX - offsetX;
        const worldScreenY = mouseY - offsetY;
        
        const mapPos = IsoUtils.screenToMap(worldScreenX, worldScreenY);
        const mapX = Math.round(mapPos.x);
        const mapY = Math.round(mapPos.y);
        
        // Draw Highlight
        ctx.save();
        ctx.translate(offsetX, offsetY); // Apply same camera transform
        
        const pos = IsoUtils.mapToScreen(mapX, mapY);
        const w = IsoUtils.TILE_WIDTH;
        const h = IsoUtils.TILE_HEIGHT;

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - h / 2);
        ctx.lineTo(pos.x + w / 2, pos.y);
        ctx.lineTo(pos.x, pos.y + h / 2);
        ctx.lineTo(pos.x - w / 2, pos.y);
        ctx.closePath();

        ctx.strokeStyle = "rgba(226, 18, 36, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "rgba(226, 18, 36, 0.2)";
        ctx.fill();
        
        ctx.restore();
        
        return { mapX, mapY };
    }
}
