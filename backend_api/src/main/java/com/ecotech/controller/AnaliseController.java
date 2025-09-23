package com.ecotech.controller;

import com.ecotech.model.ConsumoMensal; // Ainda usamos o DTO ConsumoMensal
import com.ecotech.model.ConsumoEquipamento;
import com.ecotech.repository.ConsumoEquipamentoRepository; // Agora depende deste
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/analise-consumo")
public class AnaliseController {

    @Autowired
    private ConsumoEquipamentoRepository consumoEquipamentoRepository;

    private static final List<String> MESES_ORDEM = List.of(
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    );

    @GetMapping
    public Map<String, Object> analiseConsumo() {
        List<ConsumoEquipamento> todosConsumosEquipamento = consumoEquipamentoRepository.findAll();
        Map<String, Object> resultado = new HashMap<>();

        // 1. Agrupar e somar o consumo por Ano e Mês
        Map<Integer, Map<String, Integer>> consumoAgregadoPorAnoMes = new TreeMap<>(); // TreeMap para ordenar anos
        for (ConsumoEquipamento ce : todosConsumosEquipamento) {
            consumoAgregadoPorAnoMes
                    .computeIfAbsent(ce.getAno(), k -> new TreeMap<>((m1, m2) -> MESES_ORDEM.indexOf(m1) - MESES_ORDEM.indexOf(m2)))
                    .merge(ce.getMes(), ce.getConsumoKWh(), Integer::sum);
        }

        // 2. Converter para uma lista ordenada de ConsumoMensal temporário para facilitar a análise
        List<ConsumoMensal> consumosTotaisOrdenados = new ArrayList<>();
        consumoAgregadoPorAnoMes.forEach((ano, mesesConsumo) -> {
            mesesConsumo.forEach((mes, consumoTotal) -> {
                ConsumoMensal cm = new ConsumoMensal();
                cm.setMes(mes);
                cm.setAno(ano);
                cm.setConsumo(consumoTotal);
                consumosTotaisOrdenados.add(cm);
            });
        });

        // 3. Ordenar a lista final por ano e depois por mês para garantir que "atual" e "anterior" estejam corretos
        consumosTotaisOrdenados.sort(Comparator
                .comparing(ConsumoMensal::getAno)
                .thenComparingInt(cm -> MESES_ORDEM.indexOf(cm.getMes())));


        if (consumosTotaisOrdenados.size() < 2) {
            resultado.put("mensagem", "Dados insuficientes para análise de economia entre meses.");
            return resultado;
        }

        ConsumoMensal atual = consumosTotaisOrdenados.get(consumosTotaisOrdenados.size() - 1);
        ConsumoMensal anterior = consumosTotaisOrdenados.get(consumosTotaisOrdenados.size() - 2);

        int economia = anterior.getConsumo() - atual.getConsumo();
        double percentual = 0;
        if (anterior.getConsumo() != 0) {
            percentual = (economia / (double) anterior.getConsumo()) * 100;
        }


        resultado.put("mes", atual.getMes());
        resultado.put("ano", atual.getAno());
        resultado.put("consumo_atual", atual.getConsumo());
        resultado.put("consumo_anterior", anterior.getConsumo());
        resultado.put("economia", economia);
        resultado.put("percentual", Math.round(percentual));

        return resultado;
    }
}