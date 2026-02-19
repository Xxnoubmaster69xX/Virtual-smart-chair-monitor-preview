import { Matrix15x15, MATRIX_SIZE } from "../types";

/**
 * LOCAL BIO-MECHANICS ANALYZER
 * Replaces the Cloud AI with deterministic algorithms for student project use.
 * This runs 100% in the browser, costs $0, and works offline.
 */

export const analyzePosture = async (matrix: Matrix15x15): Promise<string> => {
  // 1. Calculate Statistics
  let totalPressure = 0;
  let leftPressure = 0;
  let rightPressure = 0;
  let frontPressure = 0; // Row > 7
  let backPressure = 0;  // Row <= 7
  let peakPressure = 0;
  let activeCells = 0;

  for (let r = 0; r < MATRIX_SIZE; r++) {
    for (let c = 0; c < MATRIX_SIZE; c++) {
      const val = matrix[r][c];
      if (val > 20) { // Noise threshold
        totalPressure += val;
        activeCells++;
        if (val > peakPressure) peakPressure = val;

        // Quadrant Analysis
        if (c < MATRIX_SIZE / 2) leftPressure += val;
        else rightPressure += val;

        if (r > MATRIX_SIZE / 2) frontPressure += val;
        else backPressure += val;
      }
    }
  }

  // 2. Generate Report
  const now = new Date().toLocaleTimeString();
  let report = `### Postural Analysis Report (${now})\n\n`;

  // No user detected
  if (activeCells < 5 || totalPressure < 100) {
    return report + "**Status:** No user detected on seat.\n\n*Waiting for pressure data...*";
  }

  // 3. Posture heuristics
  const lrRatio = leftPressure / (totalPressure || 1);
  const fbRatio = frontPressure / (totalPressure || 1);

  report += "**Postural Alignment:**\n";
  
  // Left/Right Analysis
  if (lrRatio > 0.55) {
    report += "- ⚠️ **Leaning Left:** Significant weight asymmetry detected on the left side.\n";
  } else if (lrRatio < 0.45) {
    report += "- ⚠️ **Leaning Right:** Significant weight asymmetry detected on the right side.\n";
  } else {
    report += "- ✅ **Lateral Balance:** Good (Center).\n";
  }

  // Front/Back Analysis
  if (fbRatio > 0.60) {
    report += "- ⚠️ **Forward Shift:** High pressure near knees (Slouching risk).\n";
  } else if (fbRatio < 0.30) {
    report += "- ℹ️ **Reclined:** Most weight is on the tailbone/sacrum.\n";
  } else {
    report += "- ✅ **Sagittal Balance:** Neutral sitting position.\n";
  }

  report += "\n**Pressure Distribution:**\n";
  report += `- **Peak Pressure:** ${peakPressure}/1023 ${(peakPressure > 900 ? "(CRITICAL)" : peakPressure > 700 ? "(HIGH)" : "(NORMAL)")}\n`;
  report += `- **Load Asymmetry:** ${Math.abs((lrRatio - 0.5) * 200).toFixed(1)}%\n`;

  // 4. Recommendations
  report += "\n**Recommendations:**\n";
  if (peakPressure > 850) {
    report += "1. **IMMEDIATE REPOSITIONING:** Peak pressure indicates high risk of ischemia.\n";
  }
  if (lrRatio > 0.55 || lrRatio < 0.45) {
    report += "2. **Check Supports:** Adjust footrests or armrests to correct lateral lean.\n";
  }
  if (activeCells < 20 && totalPressure > 2000) {
    report += "3. **Surface Area:** Weight is concentrated in a small area. Consider a softer cushion material.\n";
  }
  if (!report.includes("IMMEDIATE") && !report.includes("Check Supports")) {
    report += "1. Maintain current posture.\n2. Perform standard pressure relief lift every 30 mins.";
  }

  return report;
};