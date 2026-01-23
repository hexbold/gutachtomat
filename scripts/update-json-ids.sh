#!/bin/bash
# Script to update old IDs in JSON test data files

# Find all JSON files in test directory
FILES=$(find test -type f -name "*.json" ! -path "*/node_modules/*")

for file in $FILES; do
  # Gender IDs
  sed -i '' 's/"GS001"/"geschlecht_maennlich"/g' "$file"
  sed -i '' 's/"GS002"/"geschlecht_weiblich"/g' "$file"
  sed -i '' 's/"GS003"/"geschlecht_divers"/g' "$file"

  # Therapy form IDs
  sed -i '' 's/"TF001"/"therapie_verhaltenstherapie"/g' "$file"
  sed -i '' 's/"TF002"/"therapie_analytisch"/g' "$file"
  sed -i '' 's/"TF003"/"therapie_tiefenpsychologisch"/g' "$file"
  sed -i '' 's/"TF004"/"therapie_systemisch"/g' "$file"

  # Treatment form IDs
  sed -i '' 's/"BF001"/"behandlung_einzel"/g' "$file"
  sed -i '' 's/"BF002"/"behandlung_gruppe"/g' "$file"
  sed -i '' 's/"BF003"/"behandlung_einzel_gruppe"/g' "$file"

  # Application type IDs
  sed -i '' 's/"AA001"/"antrag_erst"/g' "$file"
  sed -i '' 's/"AA002"/"antrag_umwandlung"/g' "$file"
  sed -i '' 's/"AA003"/"antrag_fortfuehrung"/g' "$file"

  # Family status IDs
  sed -i '' 's/"FS001"/"familienstand_ledig"/g' "$file"
  sed -i '' 's/"FS002"/"familienstand_verheiratet"/g' "$file"
  sed -i '' 's/"FS003"/"familienstand_verwitwet"/g' "$file"
  sed -i '' 's/"FS004"/"familienstand_geschieden"/g' "$file"
  sed -i '' 's/"FS005"/"familienstand_partnerschaft"/g' "$file"

  # Living situation IDs
  sed -i '' 's/"WS001"/"wohnung_mit_partner"/g' "$file"
  sed -i '' 's/"WS002"/"wohnung_bei_eltern"/g' "$file"
  sed -i '' 's/"WS003"/"wohnung_mit_kindern"/g' "$file"
  sed -i '' 's/"WS004"/"wohnung_allein"/g' "$file"
  sed -i '' 's/"WS005"/"wohnung_wg"/g' "$file"

  # Financial situation IDs
  sed -i '' 's/"FIN001"/"finanzen_angespannt"/g' "$file"
  sed -i '' 's/"FIN002"/"finanzen_ausreichend"/g' "$file"
  sed -i '' 's/"FIN003"/"finanzen_stabil"/g' "$file"

  # Somatic pre-existing conditions IDs
  sed -i '' 's/"SV001"/"somatik_keine"/g' "$file"
  sed -i '' 's/"SV002"/"somatik_vorhanden"/g' "$file"

  # Duration unit IDs
  sed -i '' 's/"DAUER_WOCHEN"/"dauer_wochen"/g' "$file"
  sed -i '' 's/"DAUER_MONATE"/"dauer_monate"/g' "$file"

  # Prescribed by IDs
  sed -i '' 's/"VERSCHR_HAUSARZT"/"verschr_hausarzt"/g' "$file"
  sed -i '' 's/"VERSCHR_PSYCHIATER"/"verschr_psychiater"/g' "$file"
  sed -i '' 's/"VERSCHR_ANDERE"/"verschr_andere"/g' "$file"

  # Treatment setting IDs
  sed -i '' 's/"SETTING_STATIONAER"/"setting_stationaer"/g' "$file"
  sed -i '' 's/"SETTING_TAGKLINISCH"/"setting_tagklinisch"/g' "$file"
  sed -i '' 's/"SETTING_AMBULANT"/"setting_ambulant"/g' "$file"

  # Treatment period unit IDs
  sed -i '' 's/"ZEITRAUM_WOCHEN"/"zeitraum_wochen"/g' "$file"
  sed -i '' 's/"ZEITRAUM_MONATE"/"zeitraum_monate"/g' "$file"

  # Report IDs
  sed -i '' 's/"ABSCHLUSS_VORHANDEN"/"abschluss_vorhanden"/g' "$file"
  sed -i '' 's/"ABSCHLUSS_NICHT_VORHANDEN"/"abschluss_nicht_vorhanden"/g' "$file"
  sed -i '' 's/"ABSCHLUSS_NICHT_EINGEFORDERT"/"abschluss_nicht_eingefordert"/g' "$file"
  sed -i '' 's/"ABSCHLUSS_ANDERE"/"abschluss_andere"/g' "$file"

  # Family history IDs
  sed -i '' 's/"FAMILIE_UNAUFFAELLIG"/"familie_unauffaellig"/g' "$file"
  sed -i '' 's/"FAMILIE_HAEUFUNG"/"familie_haeufung"/g' "$file"

  # Alcohol/substance IDs
  sed -i '' 's/"ALKOHOL_BIER"/"alkohol_bier"/g' "$file"
  sed -i '' 's/"ALKOHOL_WEIN"/"alkohol_wein"/g' "$file"
  sed -i '' 's/"ALKOHOL_SCHNAPS"/"alkohol_schnaps"/g' "$file"

  # Consumption frequency IDs
  sed -i '' 's/"HAEUFIGKEIT_TAEGLICH"/"haeufigkeit_taeglich"/g' "$file"
  sed -i '' 's/"HAEUFIGKEIT_WOECHENTLICH"/"haeufigkeit_woechentlich"/g' "$file"
  sed -i '' 's/"HAEUFIGKEIT_GELEGENTLICH"/"haeufigkeit_gelegentlich"/g' "$file"

  # Unit IDs
  sed -i '' 's/"EINHEIT_G"/"einheit_g"/g' "$file"
  sed -i '' 's/"EINHEIT_MG"/"einheit_mg"/g' "$file"
  sed -i '' 's/"EINHEIT_ML"/"einheit_ml"/g' "$file"
  sed -i '' 's/"EINHEIT_L"/"einheit_l"/g' "$file"
done

echo "✅ Updated IDs in all JSON test data files"
echo "📊 Total files updated: $(echo "$FILES" | wc -l)"
