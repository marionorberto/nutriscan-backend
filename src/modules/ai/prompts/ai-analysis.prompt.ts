export function cleanImageInfoPrompt(input: any): string {
  return `
You are a clinical nutrition assistant.

You MUST:
- organize the data properly
- separate only the foods on data given
- only orgaze well the data
- only consider foods words
- choose one if you get the same name of food, if the same name of food is for ex: rice and cooked rice, better choose cooked rice option , because is more especific
- if one food come for ex: white rice, cooked rice, rice, only join the word to be clear that is white rice cooked.
- the return value must be exclusivly the json array with food found ou empty array no additional info given from you

Input data (JSON):
${JSON.stringify(input)}

Return STRICT JSON with ex:
[
"rice",
"potate",
"banana"
"bean fried"
"chicken grilled"
]
`;
}

export function cleanFoodDataApiInfoPrompt(input: any): string {
  return `
You are a clinical nutrition assistant.

You MUST:
- organize the data properly
- separate each word that was given to you and 
- only orgaze well the data
- only consider foods words
- choose one if you get the same name of food, if the same name of food is for ex: rice and cooked rice, better choose cooked rice option , because is more especific
- if one food come for ex: white rice, cooked rice, rice, only join the word to be clear that is white rice cooked.

Input data (JSON):
${JSON.stringify(input)}

Return STRICT JSON with ex:
[
"rice",
"potate",
"banana"
"bean fried"
"chicken grilled"
]

`;
}

export function finalResponsePrompt(
  userProfileData: any,
  nutritionalInfoFromImage: any,
): string {
  return `
You are a clinical nutrition assistant.

You MUST:
- organize the data properly
- separate only the foods on data given
- only orgaze well the data
- only consider foods words
- choose one if you get the same name of food, if the same name of food is for ex: rice and cooked rice, better choose cooked rice option , because is more especific
- if one food come for ex: white rice, cooked rice, rice, only join the word to be clear that is white rice cooked.

Input data (JSON):
${JSON.stringify(userProfileData)} / ${JSON.stringify(nutritionalInfoFromImage)}

Return STRICT JSON with ex:
[
"rice",
"potate",
"banana"
"bean fried"
"chicken grilled"
]
`;
}
