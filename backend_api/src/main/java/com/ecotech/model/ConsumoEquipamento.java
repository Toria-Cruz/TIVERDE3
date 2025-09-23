package com.ecotech.model;

import jakarta.persistence.*;

@Entity
public class ConsumoEquipamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne // Relacionamento com Dispositivo
    @JoinColumn(name = "dispositivo_id", nullable = false)
    private Dispositivo dispositivo;

    private String mes;
    private int ano;
    private int consumoKWh; // Consumo específico daquele equipamento no mês

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Dispositivo getDispositivo() {
        return dispositivo;
    }

    public void setDispositivo(Dispositivo dispositivo) {
        this.dispositivo = dispositivo;
    }

    public String getMes() {
        return mes;
    }

    public void setMes(String mes) {
        this.mes = mes;
    }

    public int getAno() {
        return ano;
    }

    public void setAno(int ano) {
        this.ano = ano;
    }

    public int getConsumoKWh() {
        return consumoKWh;
    }

    public void setConsumoKWh(int consumoKWh) {
        this.consumoKWh = consumoKWh;
    }
}