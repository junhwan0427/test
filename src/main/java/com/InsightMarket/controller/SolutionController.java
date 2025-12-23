package com.InsightMarket.controller;


import com.InsightMarket.dto.PageRequestDTO;
import com.InsightMarket.dto.PageResponseDTO;
import com.InsightMarket.dto.solution.SolutionDTO;
import com.InsightMarket.service.solution.SolutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/solution")
public class SolutionController {

    private final SolutionService solutionService;

    @GetMapping("/list")
    public PageResponseDTO<SolutionDTO> list(PageRequestDTO pageRequestDTO){

        log.info("SolutionController 진입 프로젝트n 의 솔루션을 조회합니다.");

        return solutionService.getSolutionsByProjectId(pageRequestDTO);
    }
    @GetMapping("/test")
    public String test() {
        return "ok";
    }



}
