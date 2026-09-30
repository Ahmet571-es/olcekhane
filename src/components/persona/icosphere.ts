/**
 * Birim küre ağı: ikosahedronun 20 yüzünün her biri n×n küçük üçgene bölünür ve noktalar küreye
 * izdüşürülür. Kenarlardaki noktalar komşu yüzlerde tekrar eder; gölgelendirici her noktayı yalnızca
 * yönüne göre ittiği için tekrar eden noktalar aynı yere gider ve dikiş oluşmaz.
 */
export interface SphereMesh {
  /** x, y, z üçlüleri; hepsi birim uzunlukta. */
  positions: Float32Array;
  indices: Uint16Array | Uint32Array;
}

const T = (1 + Math.sqrt(5)) / 2;

const CORNERS: readonly (readonly [number, number, number])[] = [
  [-1, T, 0],
  [1, T, 0],
  [-1, -T, 0],
  [1, -T, 0],
  [0, -1, T],
  [0, 1, T],
  [0, -1, -T],
  [0, 1, -T],
  [T, 0, -1],
  [T, 0, 1],
  [-T, 0, -1],
  [-T, 0, 1],
];

const FACES: readonly (readonly [number, number, number])[] = [
  [0, 11, 5],
  [0, 5, 1],
  [0, 1, 7],
  [0, 7, 10],
  [0, 10, 11],
  [1, 5, 9],
  [5, 11, 4],
  [11, 10, 2],
  [10, 7, 6],
  [7, 1, 8],
  [3, 9, 4],
  [3, 4, 2],
  [3, 2, 6],
  [3, 6, 8],
  [3, 8, 9],
  [4, 9, 5],
  [2, 4, 11],
  [6, 2, 10],
  [8, 6, 7],
  [9, 8, 1],
];

export function icosphere(n: number): SphereMesh {
  const div = Math.max(1, Math.floor(n));
  const perFace = ((div + 1) * (div + 2)) / 2;
  const positions = new Float32Array(FACES.length * perFace * 3);
  const triangles = FACES.length * div * div;
  const indices = FACES.length * perFace > 65535 ? new Uint32Array(triangles * 3) : new Uint16Array(triangles * 3);

  let pv = 0;
  let pi = 0;
  FACES.forEach(([ia, ib, ic], face) => {
    const a = CORNERS[ia];
    const b = CORNERS[ib];
    const c = CORNERS[ic];
    const base = face * perFace;
    // i. satırda (0..div) div − i + 1 nokta vardır; satırın ilk noktasının sırası: i(2·div + 3 − i)/2.
    const at = (i: number, j: number) => base + (i * (2 * div + 3 - i)) / 2 + j;

    for (let i = 0; i <= div; i++) {
      for (let j = 0; j <= div - i; j++) {
        const x = a[0] + ((b[0] - a[0]) * i + (c[0] - a[0]) * j) / div;
        const y = a[1] + ((b[1] - a[1]) * i + (c[1] - a[1]) * j) / div;
        const z = a[2] + ((b[2] - a[2]) * i + (c[2] - a[2]) * j) / div;
        const len = Math.hypot(x, y, z);
        positions[pv++] = x / len;
        positions[pv++] = y / len;
        positions[pv++] = z / len;
      }
    }

    for (let i = 0; i < div; i++) {
      for (let j = 0; j < div - i; j++) {
        indices[pi++] = at(i, j);
        indices[pi++] = at(i + 1, j);
        indices[pi++] = at(i, j + 1);
        if (j < div - i - 1) {
          indices[pi++] = at(i + 1, j);
          indices[pi++] = at(i + 1, j + 1);
          indices[pi++] = at(i, j + 1);
        }
      }
    }
  });

  return { positions, indices };
}
