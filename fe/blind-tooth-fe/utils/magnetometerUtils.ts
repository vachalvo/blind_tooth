const MagnetometerUtils = {
  getAngle: (magnetometer: any) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y, z } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  },
  getDirectionLevel: (currentDegree: number, targetDegree: number) => {
    console.log({ currentDegree, targetDegree });
    const normalizeDeg = (targetDegree - currentDegree) % 360;

    let a = 0;
    if (normalizeDeg >= -22.5 && normalizeDeg < 22.5) {
      return 0;
    } else if (normalizeDeg >= -90 && normalizeDeg < -22.5) {
      return -1;
    } else if (normalizeDeg >= -180 && normalizeDeg < -90) {
      return -2;
    } else if (normalizeDeg >= 22.5 && normalizeDeg < 90) {
      return 1;
    } else if (normalizeDeg >= 90 && normalizeDeg < 180) {
      return 2;
    } else {
      return 3;
    }
  },
  getDegree: (magnetometer: any) => {
    return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  },
};

export default MagnetometerUtils;
