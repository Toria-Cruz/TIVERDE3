package com.ecotech.model;

import jakarta.persistence.*;

public class ConsumoMensal {

    private Long id;

    private String mes;
    private int consumo;
    private int ano;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMes() { return mes; }
    public void setMes(String mes) { this.mes = mes; }

    public int getConsumo() { return consumo; }
    public void setConsumo(int consumo) { this.consumo = consumo; }

    public int getAno() { return ano; }
    public void setAno(int ano) { this.ano = ano; }
}