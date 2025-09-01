"""
Analytics API endpoints for workflow intelligence and business insights.
"""

import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_tenant, get_db
from app.models.tenant import Tenant
from app.services.advanced_analytics_service import (
    AdvancedAnalyticsService,
    AnalyticsMetric,
    BusinessIntelligenceReport,
    PredictionResult,
    ROIAnalysis,
    TimeGranularity,
    TrendAnalysis,
)
from app.schemas.analytics import (
    AnalyticsDashboardResponse,
    BusinessIntelligenceReportResponse,
    CustomAnalyticsRequest,
    CustomAnalyticsResponse,
    MetricDataPoint,
    PredictionResponse,
    ROIAnalysisResponse,
    TrendAnalysisResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=AnalyticsDashboardResponse)
async def get_analytics_dashboard(
    time_period_days: int = Query(30, ge=1, le=365, description="Time period in days"),
    include_predictions: bool = Query(True, description="Include predictive analytics"),
    db: Session = Depends(get_db),
    current_tenant: Tenant = Depends(get_current_tenant),
) -> AnalyticsDashboardResponse:
    """Get comprehensive analytics dashboard data."""
    try:
        analytics_service = AdvancedAnalyticsService(db)

        # Generate business intelligence report
        report = await analytics_service.generate_business_intelligence_report(
            tenant_id=current_tenant.id,
            time_period_days=time_period_days,
            include_predictions=include_predictions,
        )

        # Convert to response format
        return AnalyticsDashboardResponse(
            tenant_id=str(current_tenant.id),
            tenant_name=current_tenant.name,
            report_period=report.report_period,
            generated_at=report.generated_at,
            executive_summary=report.executive_summary,
            key_metrics=report.key_metrics,
            trends=[
                TrendAnalysisResponse(
                    metric=trend.metric,
                    trend=trend.trend,
                    slope=trend.slope,
                    confidence=trend.confidence,
                    period_days=trend.period_days,
                    data_points=[
                        MetricDataPoint(
                            timestamp=point[0],
                            value=point[1]
                        ) for point in trend.data_points
                    ]
                ) for trend in report.trends
            ],
            predictions=[
                PredictionResponse(
                    metric=prediction.metric,
                    predicted_value=prediction.predicted_value,
                    confidence_interval=prediction.confidence_interval,
                    confidence_level=prediction.confidence_level,
                    model_used=prediction.model_used.value,
                    forecast_horizon=prediction.forecast_horizon,
                    forecast_period=prediction.forecast_period,
                    historical_data_points=prediction.historical_data_points,
                ) for prediction in report.predictions
            ],
            roi_analysis=ROIAnalysisResponse(
                total_investment=float(report.roi_analysis.total_investment),
                total_return=float(report.roi_analysis.total_return),
                roi_percentage=report.roi_analysis.roi_percentage,
                payback_period_days=report.roi_analysis.payback_period_days,
                break_even_date=report.roi_analysis.break_even_date,
                cost_savings=float(report.roi_analysis.cost_savings),
                productivity_gains=float(report.roi_analysis.productivity_gains),
                revenue_increase=float(report.roi_analysis.revenue_increase),
            ) if report.roi_analysis else None,
            recommendations=report.recommendations,
            alerts=report.alerts,
        )

    except Exception as e:
        logger.error(f"Analytics dashboard error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate analytics dashboard: {str(e)}"
        )


@router.get("/metrics/{metric_type}")
async def get_metric_data(
    metric_type: AnalyticsMetric,
    start_date: Optional[datetime] = Query(None, description="Start date for metrics"),
    end_date: Optional[datetime] = Query(None, description="End date for metrics"),
    granularity: TimeGranularity = Query(TimeGranularity.DAILY, description="Time granularity"),
    db: Session = Depends(get_db),
    current_tenant: Tenant = Depends(get_current_tenant),
) -> Dict[str, Any]:
    """Get specific metric data with customizable time range."""
    try:
        analytics_service = AdvancedAnalyticsService(db)

        # Default to last 30 days if no dates provided
        if not start_date:
            start_date = datetime.utcnow() - timedelta(days=30)
        if not end_date:
            end_date = datetime.utcnow()

        custom_analytics = await analytics_service.get_custom_analytics(
            tenant_id=current_tenant.id,
            metrics=[metric_type.value],
            start_date=start_date,
            end_date=end_date,
            granularity=granularity,
        )

        return custom_analytics

    except Exception as e:
        logger.error(f"Metric data retrieval error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve metric data: {str(e)}"
        )


@router.post("/custom", response_model=CustomAnalyticsResponse)
async def get_custom_analytics(
    request: CustomAnalyticsRequest,
    db: Session = Depends(get_db),
    current_tenant: Tenant = Depends(get_current_tenant),
) -> CustomAnalyticsResponse:
    """Get custom analytics based on specific requirements."""
    try:
        analytics_service = AdvancedAnalyticsService(db)

        custom_analytics = await analytics_service.get_custom_analytics(
            tenant_id=current_tenant.id,
            metrics=request.metrics,
            start_date=request.start_date,
            end_date=request.end_date,
            granularity=request.granularity,
        )

        return CustomAnalyticsResponse(
            tenant_id=str(current_tenant.id),
            time_period={
                "start": request.start_date.isoformat(),
                "end": request.end_date.isoformat(),
                "granularity": request.granularity.value,
            },
            data=custom_analytics.get("data", {}),
        )

    except Exception as e:
        logger.error(f"Custom analytics error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate custom analytics: {str(e)}"
        )


@router.get("/predictions/{metric_type}")
async def get_predictions(
    metric_type: str,
    forecast_days: int = Query(30, ge=1, le=365, description="Forecast horizon in days"),
    db: Session = Depends(get_db),
    current_tenant: Tenant = Depends(get_current_tenant),
) -> Dict[str, Any]:
    """Get predictions for specific metrics."""
    try:
        analytics_service = AdvancedAnalyticsService(db)

        # Get historical data for prediction
        historical_days = min(forecast_days * 3, 90)  # Use 3x forecast period or 90 days max

        predictions = []
        if metric_type == "usage":
            usage_prediction = await analytics_service._predict_metric(
                current_tenant.id, "usage_requests", historical_days, forecast_days
            )
            if usage_prediction:
                predictions.append({
                    "metric": usage_prediction.metric,
                    "predicted_value": usage_prediction.predicted_value,
                    "confidence_interval": usage_prediction.confidence_interval,
                    "confidence_level": usage_prediction.confidence_level,
                    "model_used": usage_prediction.model_used.value,
                    "forecast_horizon": usage_prediction.forecast_horizon,
                    "forecast_period": usage_prediction.forecast_period,
                })

        elif metric_type == "cost":
            cost_prediction = await analytics_service._predict_metric(
                current_tenant.id, "cost", historical_days, forecast_days
            )
            if cost_prediction:
                predictions.append({
                    "metric": cost_prediction.metric,
                    "predicted_value": cost_prediction.predicted_value,
                    "confidence_interval": cost_prediction.confidence_interval,
                    "confidence_level": cost_prediction.confidence_level,
                    "model_used": cost_prediction.model_used.value,
                    "forecast_horizon": cost_prediction.forecast_horizon,
                    "forecast_period": cost_prediction.forecast_period,
                })

        return {
            "tenant_id": str(current_tenant.id),
            "metric_type": metric_type,
            "forecast_horizon_days": forecast_days,
            "predictions": predictions,
        }

    except Exception as e:
        logger.error(f"Predictions error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate predictions: {str(e)}"
        )


@router.get("/trends")
async def get_trends(
    time_period_days: int = Query(30, ge=7, le=365, description="Trend analysis period"),
    db: Session = Depends(get_db),
    current_tenant: Tenant = Depends(get_current_tenant),
) -> Dict[str, Any]:
    """Get trend analysis for key metrics."""
    try:
        analytics_service = AdvancedAnalyticsService(db)

        trends = await analytics_service._analyze_trends(
            current_tenant.id, time_period_days
        )

        return {
            "tenant_id": str(current_tenant.id),
            "analysis_period_days": time_period_days,
            "trends": [
                {
                    "metric": trend.metric,
                    "trend": trend.trend,
                    "slope": trend.slope,
                    "confidence": trend.confidence,
                    "period_days": trend.period_days,
                    "data_points_count": len(trend.data_points),
                } for trend in trends
            ],
        }

    except Exception as e:
        logger.error(f"Trends analysis error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze trends: {str(e)}"
        )


@router.get("/roi-analysis")
async def get_roi_analysis(
    time_period_days: int = Query(90, ge=30, le=365, description="ROI analysis period"),
    db: Session = Depends(get_db),
    current_tenant: Tenant = Depends(get_current_tenant),
) -> Dict[str, Any]:
    """Get ROI analysis for the tenant."""
    try:
        analytics_service = AdvancedAnalyticsService(db)

        roi_analysis = await analytics_service._calculate_roi_analysis(
            current_tenant.id, time_period_days
        )

        return {
            "tenant_id": str(current_tenant.id),
            "analysis_period_days": time_period_days,
            "roi_analysis": {
                "total_investment": float(roi_analysis.total_investment),
                "total_return": float(roi_analysis.total_return),
                "roi_percentage": roi_analysis.roi_percentage,
                "payback_period_days": roi_analysis.payback_period_days,
                "break_even_date": roi_analysis.break_even_date.isoformat(),
                "cost_savings": float(roi_analysis.cost_savings),
                "productivity_gains": float(roi_analysis.productivity_gains),
                "revenue_increase": float(roi_analysis.revenue_increase),
            },
        }

    except Exception as e:
        logger.error(f"ROI analysis error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate ROI: {str(e)}"
        )


@router.get("/health")
async def analytics_health_check() -> Dict[str, str]:
    """Health check for analytics service."""
    return {"status": "healthy", "service": "analytics"}
