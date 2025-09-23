package com.ecotech.controller;

import com.ecotech.model.Dispositivo;
import com.ecotech.repository.DispositivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/dispositivos")
public class DispositivoController {
    @Autowired
    private DispositivoRepository repository;

    @GetMapping
    public List<Dispositivo> listar() {
        return repository.findAll();
    }

    @GetMapping("/resumo")
    public Map<String, Long> resumoPorTipo() {
        return repository.findAll().stream()
                .collect(Collectors.groupingBy(Dispositivo::getTipo, Collectors.counting()));
    }

    @GetMapping("/resumo-ativos")
    public Map<String, Long> resumoAtivosPorTipo() {
        return repository.findAll().stream()
                .filter(Dispositivo::isAtivo)
                .collect(Collectors.groupingBy(Dispositivo::getTipo, Collectors.counting()));
    }

}