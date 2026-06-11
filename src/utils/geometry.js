import * as THREE from 'three'

/**
 * Un plan vertical légèrement ondulé, pour donner du tombé aux rideaux.
 */
export const makeCurtainGeometry = () => {
  const geometry = new THREE.PlaneGeometry(0.42, 1.72, 12, 1)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, Math.sin(pos.getX(i) * 22) * 0.028)
  }
  geometry.computeVertexNormals()
  return geometry
}
