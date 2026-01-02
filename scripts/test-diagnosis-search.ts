/**
 * Quick test to verify the diagnosis search functionality
 */

import { searchDiagnoses, icd10Diagnoses, diagnosisSections } from '../src/lib/data/icd10-diagnoses';

console.log('=== ICD-10 Diagnosis System Test ===\n');

console.log(`Total diagnoses: ${icd10Diagnoses.length}`);
console.log(`Total sections: ${diagnosisSections.length}\n`);

console.log('Sections:');
diagnosisSections.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));

console.log('\n=== Search Tests ===\n');

// Test 1: Search by code
console.log('Test 1: Search for "F32.1"');
const test1 = searchDiagnoses('F32.1');
console.log(`Found ${test1.length} results:`);
test1.forEach(d => console.log(`  - ${d.code}: ${d.name}`));

// Test 2: Search by partial code
console.log('\nTest 2: Search for "F32"');
const test2 = searchDiagnoses('F32');
console.log(`Found ${test2.length} results:`);
test2.slice(0, 5).forEach(d => console.log(`  - ${d.code}: ${d.name}`));
if (test2.length > 5) console.log(`  ... and ${test2.length - 5} more`);

// Test 3: Search by name
console.log('\nTest 3: Search for "Depression"');
const test3 = searchDiagnoses('Depression');
console.log(`Found ${test3.length} results:`);
test3.forEach(d => console.log(`  - ${d.code}: ${d.name}`));

// Test 4: Search F00-F09 section (new diagnoses)
console.log('\nTest 4: Search for "Demenz" (from F00-F09 section)');
const test4 = searchDiagnoses('Demenz');
console.log(`Found ${test4.length} results:`);
test4.slice(0, 5).forEach(d => console.log(`  - ${d.code}: ${d.name}`));
if (test4.length > 5) console.log(`  ... and ${test4.length - 5} more`);

// Test 5: Check F90-F98 section
console.log('\nTest 5: Search for "ADHS" or "Hyperkinetisch"');
const test5 = searchDiagnoses('Hyperkinetisch');
console.log(`Found ${test5.length} results:`);
test5.forEach(d => console.log(`  - ${d.code}: ${d.name}`));

// Test 6: Check Z codes
console.log('\nTest 6: Search for "Z73" (Burn-out)');
const test6 = searchDiagnoses('Z73');
console.log(`Found ${test6.length} results:`);
test6.forEach(d => console.log(`  - ${d.code}: ${d.name}`));

console.log('\n=== Test Complete ===');
