package com.ecotech.controller;

import com.ecotech.model.ConsumoEquipamento;
import com.ecotech.repository.ConsumoEquipamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/consumo-equipamento")
public class ConsumoEquipamentoController {

    @Autowired
    private ConsumoEquipamentoRepository repository;

    @GetMapping
    public List<ConsumoEquipamento> listar() {
        return repository.findAll();
    }

    @GetMapping("/por-mes-ano")
    public List<ConsumoEquipamento> getConsumoPorMesAno(
            @RequestParam String mes,
            @RequestParam int ano) {
        return repository.findByMesAndAno(mes, ano);
    }

    // Endpoint para adicionar um novo registro de consumo de equipamento
    @PostMapping
    public ConsumoEquipamento adicionarConsumoEquipamento(@RequestBody ConsumoEquipamento consumoEquipamento) {
        return repository.save(consumoEquipamento);
    }

    // Novo endpoint para obter o consumo total por tipo de equipamento para um dado ano
    @GetMapping("/resumo-por-tipo")
    public Map<String, Integer> getConsumoPorTipoEquipamento(@RequestParam int ano) {
        // Busca todos os consumos de equipamento para o ano especificado
        List<ConsumoEquipamento> consumosDoAno = repository.findByAno(ano);

        // Agrupa os consumos por tipo de dispositivo e soma o consumoKWh
        Map<String, Integer> resumoPorTipo = new HashMap<>();
        for (ConsumoEquipamento ce : consumosDoAno) {
            String tipoDispositivo = ce.getDispositivo().getTipo(); // Assumindo que Dispositivo tem um campo 'tipo'
            resumoPorTipo.merge(tipoDispositivo, ce.getConsumoKWh(), Integer::sum);
        }
        return resumoPorTipo;
    }

    // Endpoint opcional para obter todos os anos disponíveis para o picker do gráfico de pizza
    @GetMapping("/anos-disponiveis-consumo-tipo")
    public List<Integer> getAnosDisponiveisConsumoTipo() {
        return repository.findAll().stream()
                .map(ConsumoEquipamento::getAno)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    @GetMapping("/detalhe-por-mes-ano")
    public List<ConsumoEquipamento> getDetalheConsumoPorMesAno(
            @RequestParam String mes,
            @RequestParam int ano) {
        return repository.findByMesAndAno(mes, ano);
    }

}