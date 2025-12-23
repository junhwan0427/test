package com.InsightMarket.service.solution;

import com.InsightMarket.dto.PageRequestDTO;
import com.InsightMarket.dto.PageResponseDTO;
import com.InsightMarket.dto.solution.SolutionDTO;
import jakarta.transaction.Transactional;

@Transactional
public interface SolutionService {
    PageResponseDTO<SolutionDTO> getSolutionsByProjectId(PageRequestDTO pageRequestDTO);

}
