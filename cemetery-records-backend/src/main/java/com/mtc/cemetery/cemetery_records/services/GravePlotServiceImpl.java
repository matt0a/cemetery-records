package com.mtc.cemetery.cemetery_records.services;

import com.mtc.cemetery.cemetery_records.domain.entities.GravePlot;
import com.mtc.cemetery.cemetery_records.repositories.GravePlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GravePlotServiceImpl implements GravePlotService {

    private final GravePlotRepository repository;

    @Override @Transactional
    public GravePlot save(GravePlot gravePlot) {
        return repository.save(gravePlot);
    }

    @Override @Transactional(readOnly = true)
    public Optional<GravePlot> findById(Long id) {
        return repository.findById(id);
    }

    @Override @Transactional(readOnly = true)
    public List<GravePlot> findAll() {
        return repository.findAll();
    }

    @Override @Transactional
    public GravePlot update(Long id, GravePlot updated) {
        GravePlot existing = repository.findById(id).orElseThrow();
        existing.setLocationDescription(updated.getLocationDescription());
        existing.setSection(updated.getSection());
        existing.setPlotNumber(updated.getPlotNumber());
        return repository.save(existing);
    }

    @Override @Transactional
    public void deleteById(Long id) {
        // If FK prevents deletion while burials reference this plot, you can
        // either cascade or check and throw 409. For now, just delete:
        repository.deleteById(id);
    }
}
