package com.ecotech.controller;

import com.ecotech.model.ConsumoMensal; // Ainda usamos o DTO ConsumoMensal
import com.ecotech.model.ConsumoEquipamento;
import com.ecotech.repository.ConsumoEquipamentoRepository; // Agora depende deste
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap; // TreeMap para manter a ordem dos anos/meses
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/consumo")
public class ConsumoController {

    @Autowired
    private ConsumoEquipamentoRepository consumoEquipamentoRepository; // Injetando o novo repositório

    private static final List<String> MESES_ORDEM = List.of(
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    );

    // Endpoint principal para listar o consumo mensal compilado
    @GetMapping
    public List<ConsumoMensal> listarConsumoMensalCompilado() {
        List<ConsumoEquipamento> todosConsumosEquipamento = consumoEquipamentoRepository.findAll();

        // Agrupa por ano e mês, somando o consumo
        Map<Integer, Map<String, Integer>> consumoAgregado = new TreeMap<>(); // TreeMap para ordenar anos
        for (ConsumoEquipamento ce : todosConsumosEquipamento) {
            consumoAgregado
                    .computeIfAbsent(ce.getAno(), k -> new TreeMap<>((m1, m2) -> MESES_ORDEM.indexOf(m1) - MESES_ORDEM.indexOf(m2))) // TreeMap para ordenar meses
                    .merge(ce.getMes(), ce.getConsumoKWh(), Integer::sum);
        }

        List<ConsumoMensal> resultado = new ArrayList<>();
        consumoAgregado.forEach((ano, mesesConsumo) -> {
            mesesConsumo.forEach((mes, consumoTotal) -> {
                ConsumoMensal cm = new ConsumoMensal();
                // O ID aqui seria arbitrário se não estiver vindo do banco, ou null
                // cm.setId(someGeneratedValue); // Se ConsumoMensal ainda tiver ID e não for persistido, o ID será ignorado
                cm.setMes(mes);
                cm.setAno(ano);
                cm.setConsumo(consumoTotal);
                resultado.add(cm);
            });
        });

        // Opcional: Ordenar a lista final por ano e depois por mês
        resultado.sort(Comparator
                .comparing(ConsumoMensal::getAno)
                .thenComparingInt(cm -> MESES_ORDEM.indexOf(cm.getMes())));

        return resultado;
    }

    // Endpoint para buscar consumo mensal compilado por ano
    @GetMapping("/por-ano")
    public List<ConsumoMensal> listarConsumoMensalCompiladoPorAno(@RequestParam(required = false) Integer ano) {
        List<ConsumoEquipamento> consumosEquipamentoFiltrados;
        if (ano != null) {
            consumosEquipamentoFiltrados = consumoEquipamentoRepository.findAll().stream()
                    .filter(ce -> ce.getAno() == ano)
                    .collect(Collectors.toList());
        } else {
            consumosEquipamentoFiltrados = consumoEquipamentoRepository.findAll();
        }

        Map<String, Integer> consumoAgregadoMes = new TreeMap<>((m1, m2) -> MESES_ORDEM.indexOf(m1) - MESES_ORDEM.indexOf(m2));
        for (ConsumoEquipamento ce : consumosEquipamentoFiltrados) {
            consumoAgregadoMes.merge(ce.getMes(), ce.getConsumoKWh(), Integer::sum);
        }

        List<ConsumoMensal> resultado = new ArrayList<>();
        consumoAgregadoMes.forEach((mes, consumoTotal) -> {
            ConsumoMensal cm = new ConsumoMensal();
            cm.setMes(mes);
            cm.setAno(ano != null ? ano : 0); // Define o ano, ou 0 se não foi filtrado
            cm.setConsumo(consumoTotal);
            resultado.add(cm);
        });

        // Ordenar por mês
        resultado.sort(Comparator.comparingInt(cm -> MESES_ORDEM.indexOf(cm.getMes())));

        return resultado;
    }

    // Endpoint para obter todos os anos disponíveis (agora do ConsumoEquipamento)
    @GetMapping("/anos-disponiveis")
    public List<Integer> getAnosDisponiveis() {
        return consumoEquipamentoRepository.findAll().stream()
                .map(ConsumoEquipamento::getAno)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}