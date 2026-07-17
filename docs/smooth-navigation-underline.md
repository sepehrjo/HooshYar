# Smooth Navigation Underline — Implementation

> Improvement completed: 2026-07-02
> Files modified: navigation.tsx, section-nav-link.tsx

---

## Problem Solved

The navigation underline indicator was appearing/disappearing abruptly when scrolling between sections. Now it **smoothly slides** from one section indicator to the next as you scroll through different pages.

---

## How It Works

### Previous Implementation
- Each nav link had its own underline that appeared/disappeared with fade-in animation
- No smooth transition between items
- Felt abrupt when changing sections

### New Implementation
- **Single shared underline** element that smoothly slides between nav items
- Underline position and width animate with CSS transitions
- Smooth 500ms ease-out transition between positions
- Uses element refs to calculate exact positions
- More refined section detection with multiple intersection thresholds

---

## Technical Details

### 1. Ref System
Each navigation link now has a ref stored in a Map:
```typescript
const navLinksRef = useRef<Map<string, HTMLElement>>(new Map());
```

SectionNavLink component updated to support `forwardRef` for measuring element positions.

### 2. Underline Positioning
When active section changes, the underline smoothly animates to the new position:
```typescript
useEffect(() => {
  const activeLink = navLinksRef.current.get(activeSection);
  if (activeLink) {
    const { offsetLeft, offsetWidth } = activeLink;
    setUnderlineStyle({
      left: offsetLeft + offsetWidth * 0.2,  // Center the 60% width
      width: offsetWidth * 0.6,
      opacity: 1,
    });
  }
}, [activeSection]);
```

### 3. Smooth Transitions
The underline uses CSS transitions for smooth movement:
```css
transition-all duration-500 ease-out
```
- **Duration**: 500ms (smooth but not sluggish)
- **Easing**: ease-out (starts fast, ends smoothly)
- **Properties**: left, width, opacity all transition together

### 4. Improved Section Detection
Multiple intersection thresholds for smoother detection:
```typescript
{ threshold: [0.3, 0.5, 0.7] }
```
Picks the section with the highest intersection ratio (most visible).

---

## Visual Behavior

### Scrolling Through Sections
1. As you scroll, sections are continuously observed
2. When a new section becomes most visible (>30% in viewport), it becomes active
3. The underline **smoothly slides** horizontally to the new nav item
4. The underline width adjusts if nav items have different widths
5. Text color transitions from muted → white in sync

### Smooth Transitions
- **Left position**: Slides smoothly (500ms)
- **Width**: Adjusts smoothly if items are different sizes (500ms)
- **Opacity**: Fades in on first appearance, maintains during movement
- **Text color**: 300ms transition (slightly faster for responsiveness)

---

## Accessibility & Performance

### Reduced Motion Support
```css
motion-reduce:transition-none
```
Users with `prefers-reduced-motion` see instant updates instead of animations.

### Performance
- Uses `passive: true` scroll listeners
- CSS transitions (hardware accelerated)
- Ref-based measurements (no DOM queries in loops)
- IntersectionObserver (efficient visibility detection)

---

## Files Modified

### 1. `/components/layout/navigation.tsx`
**Changes**:
- Added `useRef` for storing nav link elements in a Map
- Added `underlineStyle` state for smooth position tracking
- Updated IntersectionObserver with multiple thresholds [0.3, 0.5, 0.7]
- Added effect to calculate and animate underline position
- Removed individual underlines from each link
- Added single shared underline with smooth CSS transitions
- Transition duration: 500ms ease-out

**Before**:
```tsx
{isActive && (
  <span className="absolute bottom-0 left-1/2 h-[2px] w-[60%]..." />
)}
```

**After**:
```tsx
<span
  className="pointer-events-none absolute bottom-2 h-[2px] rounded-full bg-gradient-to-r from-cyan-primary via-violet-core to-magenta-glow transition-all duration-500 ease-out"
  style={{
    left: `${underlineStyle.left}px`,
    width: `${underlineStyle.width}px`,
    opacity: underlineStyle.opacity,
  }}
/>
```

### 2. `/components/layout/section-nav-link.tsx`
**Changes**:
- Converted from function component to `forwardRef` component
- Now supports ref forwarding for position measurement
- No other functionality changed

**Before**:
```tsx
export function SectionNavLink({ ... }) { ... }
```

**After**:
```tsx
export const SectionNavLink = forwardRef<HTMLAnchorElement, {...}>(
  function SectionNavLink({ ... }, ref) { ... }
);
```

---

## Testing

### Visual Tests
- [ ] Scroll slowly through all sections — underline slides smoothly
- [ ] Scroll quickly — underline keeps up without lag
- [ ] Switch language (FA ↔ EN) — underline repositions correctly
- [ ] Resize window — underline recalculates position
- [ ] Check on different browsers (Chrome, Safari, Firefox)

### Edge Cases
- [ ] First load — underline appears on Home section
- [ ] Jump to middle section — underline appears instantly at correct position
- [ ] Rapid section changes — underline doesn't jump/flicker
- [ ] Mobile view — no underline shown (desktop only)

### Performance
- [ ] No console errors during scroll
- [ ] Smooth 60fps animation (check browser performance tab)
- [ ] No layout thrashing or jank

---

## Configuration

### Timing Adjustments (if needed)

**Faster animation** (more snappy):
```tsx
transition-all duration-300 ease-out
```

**Slower animation** (more dramatic):
```tsx
transition-all duration-700 ease-out
```

**Different easing** (more elastic feel):
```tsx
transition-all duration-500 ease-in-out
```

### Detection Sensitivity

**More sensitive** (switches sections earlier):
```typescript
{ threshold: [0.2, 0.4, 0.6] }
```

**Less sensitive** (waits for more visibility):
```typescript
{ threshold: [0.4, 0.6, 0.8] }
```

---

## Design Consistency

✅ **No visual changes** to underline appearance  
✅ **Same gradient** (cyan → violet → magenta)  
✅ **Same dimensions** (2px height, 60% width)  
✅ **Same position** (centered under nav item)  
✅ **Only behavior changed** — now smoothly animated  

---

*The navigation underline now smoothly slides between sections as you scroll, providing a more polished and fluid user experience.*