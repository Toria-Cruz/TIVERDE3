package com.ecotech.repository;

import com.ecotech.model.ConsumoEquipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsumoEquipamentoRepository extends JpaRepository<ConsumoEquipamento, Long> {
    // Você pode adicionar métodos personalizados aqui se precisar de consultas específicas,
    // como buscar por mês e ano, ou por dispositivo.
    List<ConsumoEquipamento> findByMesAndAno(String mes, int ano);
    List<ConsumoEquipamento> findByDispositivoIdAndMesAndAno(Long dispositivoId, String mes, int ano);
    List<ConsumoEquipamento> findByAno(int ano); // Adicionado para o novo endpoint
}