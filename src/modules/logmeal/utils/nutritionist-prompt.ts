export interface NutritionistAnalysis {
  analysisSummary: {
    overallSafetyStatus: 'GREEN' | 'YELLOW' | 'RED';
    totalCarbsScanned: number;
    totalNetCarbsScanned: number;
    totalCaloriesScanned: number;
    mealBalance: 'BALANCED' | 'MODERATELY_BALANCED' | 'UNBALANCED';
    diabeticSuitability: 'excellent' | 'good' | 'moderate' | 'poor';
    glycemicRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  foodItemsEvaluated: Array<{
    name: string;
    isSafeForAllergies: boolean;
    glycemicImpact: 'LOW' | 'MEDIUM' | 'HIGH';
    netCarbs: number;
    recommendation: string;
    nutritionalInfo: {
      calories: number;
      carbs: number;
      netCarbs: number;
      sugar: number;
      fiber: number;
      protein: number;
      fat: number;
    };
  }>;
  finalMedicalVerdict: {
    isRecommended: boolean;
    title: string;
    reason: string;
    medicalSuggestion: string;
    suggestedPortion: string;
    alternatives: string[];
  };
  mealRecommendations: {
    insulinTiming: string;
    postMealMonitoring: string;
    exerciseSuggestion: string;
  };
}

export function createNutritionistPrompt(
  userProfileData: any,
  foodData: any,
): string {
  const { identifiedFoods, mealNutrition, insights, occasion } = foodData;

  return `
### ROLE
Você é um Nutricionista Clínico especializado em Diabetologia. Seu objetivo é analisar os alimentos com base no perfil clínico específico do paciente e fornecer uma recomendação segura e baseada em dados.

### PERFIL DO PACIENTE
${JSON.stringify(userProfileData, null, 2)}

### DADOS DA REFEIÇÃO ESCANEADA
Ocasião: ${occasion}
Itens de comida detectados: ${identifiedFoods.length} itens
Classificação da refeição: ${mealNutrition.mealType} (${mealNutrition.diabeticSuitability})

### DETALHES NUTRICIONAIS DA REFEIÇÃO COMPLETA
**Métricas para Controle Diabético:**
- Calorias Totais: ${mealNutrition.totalCalories} kcal
- Carboidratos Totais: ${mealNutrition.totalCarbs.toFixed(1)}g (${mealNutrition.dailyPercentages.carbs}% da meta diária)
- **Carboidratos Líquidos (Net Carbs):** ${mealNutrition.totalNetCarbs.toFixed(1)}g *(mais relevante para glicemia)*
- Fibras Totais: ${mealNutrition.totalFiber.toFixed(1)}g (${mealNutrition.dailyPercentages.fiber}% da meta diária)
- Açúcares Totais: ${mealNutrition.totalSugars.toFixed(1)}g
- Proteínas Totais: ${mealNutrition.totalProtein.toFixed(1)}g (${mealNutrition.dailyPercentages.protein}% da meta diária)
- Gorduras Totais: ${mealNutrition.totalFat.toFixed(1)}g

**Índices Específicos para Diabetes:**
- Carga Glicêmica: ${mealNutrition.glycemicLoad.toFixed(1)}
- Proporção Fibras/Carboidratos: ${mealNutrition.fiberToCarbRatio.toFixed(1)}%
- Saúde da Refeição para Diabéticos: ${mealNutrition.diabeticSuitability}

### ITENS ESPECÍFICOS DETECTADOS (com foco em diabetes)
${identifiedFoods
  .map(
    (item, index) => `
${index + 1}. **${item.name}** (${(item.probability * 100).toFixed(1)}% confiança | ${item.confidence})
   - Porção estimada: ${item.estimatedServing.toFixed(1)}g
   - **Dados Relevantes para Diabetes:**
     • Carboidratos: ${item.diabeticRelevantInfo.carbohydrates.toFixed(1)}g
     • **Carboidratos Líquidos:** ${item.diabeticRelevantInfo.netCarbs.toFixed(1)}g
     • Fibras: ${item.diabeticRelevantInfo.fiber.toFixed(1)}g (${item.diabeticRelevantInfo.fiberRatio.toFixed(1)}% dos carboidratos)
     • Açúcares: ${item.diabeticRelevantInfo.sugars.toFixed(1)}g
     • Carga Glicêmica: ${item.diabeticRelevantInfo.glycemicLoad.toFixed(1)}
     • Calorias: ${item.diabeticRelevantInfo.calories} kcal
   - Resumo Rápido:
     • Nível de Carboidratos: ${item.quickSummary.carbLevel}
     • Nível de Fibras: ${item.quickSummary.fiberLevel}
     • Amigável para Diabéticos: ${item.quickSummary.isDiabeticFriendly ? 'SIM' : 'NÃO'}
   - Recomendações: ${item.recommendations?.servingSuggestion || 'N/A'} - ${item.recommendations?.bestCombination || ''}
`,
  )
  .join('\n')}

### INSIGHTS AUTOMÁTICOS DA ANÁLISE
**Fontes Principais de Carboidratos:**
${insights.carbSources.map((source) => `- ${source.food}: ${source.carbs.toFixed(1)}g`).join('\n')}

**Alimentos Ricos em Fibras:** ${insights.highFiberFoods.length > 0 ? insights.highFiberFoods.join(', ') : 'Nenhum'}

**Sugestões Automáticas:**
${insights.suggestions.map((s) => `- ${s}`).join('\n')}

### INFORMAÇÕES ADICIONAIS
- Nutri-Score da Imagem: ${foodData.originalData?.nutriScore || 'Não disponível'}
- Confiança Geral da Detecção: ${identifiedFoods.every((f) => f.confidence === 'Low') ? 'Baixa' : 'Média/Alta'}

### REGRAS E CONSTRAINTS DE ANÁLISE (FOCO EM DIABETES)
1. **SEGURANÇA PRIMEIRO**: Verifique a lista de "alergias" do paciente. Se qualquer item alimentar contiver um alérgeno, "isRecommended" deve ser FALSE imediatamente.
2. **CONTROLE GLICÊMICO RIGOROSO**:
   - HbA1c atual: ${userProfileData.diabeteData?.lastHbA1c || 'N/A'}
   - Valores acima de 7.0 indicam necessidade de controle rigoroso de carboidratos
   - Priorize alimentos com baixo índice glicêmico e alta fibra
3. **ANÁLISE DE CARBOIDRATOS LÍQUIDOS**: Carboidratos Líquidos = Carboidratos Totais - Fibras. Esta é a métrica mais importante para controle glicêmico.
4. **BALANÇO DA REFEIÇÃO**:
   - Verifique se há proteínas adequadas para retardar a absorção de carboidratos
   - Avalie qualidade das gorduras (saturadas vs insaturadas)
   - Considere o timing da refeição (${occasion})
5. **HISTÓRICO MÉDICO**:
   - Hipertensão: monitorar sódio (${mealNutrition.totalSugars.toFixed(1)}g)
   - Nefropatia: atenção a proteínas se função renal comprometida
   - Retinopatia: controle glicêmico rigoroso
6. **LINGUAGEM**: Os campos "reason" e "medicalSuggestion" DEVEM estar em Português (Brasil).
7. **TOM**: Profissional, empático e baseado em evidências científicas.

### CRITÉRIOS DE AVALIAÇÃO PARA DIABÉTICOS
- **Status VERDE (RECOMENDADO)**:
  • Carboidratos líquidos < 30g por refeição
  • Boa proporção de fibras (>20% dos carboidratos)
  • Ausência de alimentos processados com alto teor de açúcar
  • Compatível com alergias/restrições do paciente
  
- **Status AMARELO (COM MODERAÇÃO)**:
  • Carboidratos líquidos 30-40g
  • Proporção de fibras 10-20%
  • Presença de algum alimento menos ideal, mas balanceado
  • Requer ajuste de porção ou combinação
  
- **Status VERMELHO (NÃO RECOMENDADO)**:
  • Carboidratos líquidos > 40g
  • Baixo teor de fibras (<10% dos carboidratos)
  • Alto teor de açúcares adicionados
  • Contém alérgenos ou contraindicado para condições do paciente

### FORMATO DE SAÍDA REQUERIDO
Você deve retornar APENAS um objeto JSON válido. Não inclua blocos markdown ou texto extra. Use o seguinte schema:

{
  "analysisSummary": {
    "overallSafetyStatus": "GREEN | YELLOW | RED",
    "totalCarbsScanned": ${mealNutrition.totalCarbs.toFixed(1)},
    "totalNetCarbsScanned": ${mealNutrition.totalNetCarbs.toFixed(1)},
    "totalCaloriesScanned": ${mealNutrition.totalCalories},
    "mealBalance": "BALANCED | MODERATELY_BALANCED | UNBALANCED",
    "diabeticSuitability": "${mealNutrition.diabeticSuitability}",
    "glycemicRisk": "LOW | MEDIUM | HIGH"
  },
  "foodItemsEvaluated": [
    {
      "name": "string",
      "isSafeForAllergies": boolean,
      "glycemicImpact": "LOW | MEDIUM | HIGH",
      "netCarbs": number,
      "recommendation": "string (breve explicação em Português)",
      "nutritionalInfo": {
        "calories": number,
        "carbs": number,
        "netCarbs": number,
        "sugar": number,
        "fiber": number,
        "protein": number,
        "fat": number
      }
    }
  ],
  "finalMedicalVerdict": {
    "isRecommended": boolean,
    "title": "string (título curto em Português, ex: 'Refeição Aprovada com Ressalvas')",
    "reason": "string (razão clínica detalhada em Português, incluindo análise de carboidratos líquidos)",
    "medicalSuggestion": "string (recomendações específicas para controle glicêmico em Português)",
    "suggestedPortion": "string (conselho sobre quantidade em Português)",
    "alternatives": ["string", "string"] (sugestões de substituição se necessário)
  },
  "mealRecommendations": {
    "insulinTiming": "string (se aplicável, ex: 'Aplicar insulina 15 minutos antes')",
    "postMealMonitoring": "string (ex: 'Monitorar glicemia 2h após a refeição')",
    "exerciseSuggestion": "string (ex: 'Caminhada de 20 minutos após 1h da refeição')"
  }
}

### NOTAS IMPORTANTES PARA A ANÁLISE
1. **Carboidratos líquidos são a métrica mais importante** para prever impacto glicêmico
2. **Considere o timing da refeição**: ${occasion} tem necessidades específicas
3. **Adapte ao perfil individual**: Pacientes com HbA1c > 8.0 requerem controle mais rigoroso
4. **Foco em educação**: Inclua explicações que ajudem o paciente a entender suas escolhas
5. **Baseie em evidências**: Use diretrizes da ADA (American Diabetes Association)
`;
}
