package com.mtc.cemetery.cemetery_records.services;

import com.mtc.cemetery.cemetery_records.domain.entities.GravePlot;
import com.mtc.cemetery.cemetery_records.repositories.GravePlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GravePlotServiceImpl implements GravePlotService {

    private final GravePlotRepository repository;

    @Override
    public GravePlot save(GravePlot gravePlot) {
        return repository.save(gravePlot);
    }

    @Override
    public Optional<GravePlot> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<GravePlot> findAll() {
        return repository.findAll();
    }

    @Override
    public GravePlot update(Long id, GravePlot updated) {
        GravePlot existing = repository.findById(id).orElseThrow();
        updated.setId(existing.getId());
        return repository.save(updated);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
