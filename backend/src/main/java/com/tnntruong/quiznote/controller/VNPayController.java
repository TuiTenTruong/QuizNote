package com.tnntruong.quiznote.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.service.VNPayService;
import com.tnntruong.quiznote.util.error.InvalidException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/payments/vnpay")
public class VNPayController {
    private final VNPayService vnPayService;

    public VNPayController(VNPayService vnPayService) {
        this.vnPayService = vnPayService;
    }

    @GetMapping("")
    public String home() {
        return "index";
    }

    @PostMapping("/submitOrder")
    public ResponseEntity<String> submidOrder(@RequestParam("amount") int orderTotal,
            @RequestParam("orderInfo") String orderInfo,
            HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":"
                + request.getServerPort();
        System.out.println(baseUrl);
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        return ResponseEntity.ok(vnpayUrl);
    }

    @GetMapping("/vnpay-payment")
    public void GetMapping(HttpServletRequest request, HttpServletResponse response, Model model)
            throws IOException {
        try {
            System.out.println("VNPay callback received");

            int paymentStatus = vnPayService.orderReturn(request);

            String orderInfo = request.getParameter("vnp_OrderInfo");
            String paymentTime = request.getParameter("vnp_PayDate");
            String transactionId = request.getParameter("vnp_TransactionNo");
            String totalPrice = request.getParameter("vnp_Amount");

            System.out.println("   Payment Status: " + paymentStatus);
            System.out.println("   Order Info: " + orderInfo);
            System.out.println("   Transaction ID: " + transactionId);
            System.out.println("   Amount: " + totalPrice);

            model.addAttribute("orderId", orderInfo);
            model.addAttribute("totalPrice", totalPrice);
            model.addAttribute("paymentTime", paymentTime);
            model.addAttribute("transactionId", transactionId);
            long amount = Long.parseLong(totalPrice) / 100;

            // Xây dựng URL redirect về frontend
            String frontendUrl = "http://localhost:5173/student/payment-result";
            String responseCode = request.getParameter("vnp_ResponseCode");

            if (paymentStatus == 1) {
                // Xử lý payment thành công
                vnPayService.handleSuccessfulPayment(orderInfo, transactionId, paymentTime, amount);

                // Redirect với thông tin thanh toán thành công
                String redirectUrl = String.format(
                        "%s?status=success&orderInfo=%s&transactionNo=%s&amount=%d&paymentTime=%s",
                        frontendUrl, orderInfo, transactionId, amount, paymentTime);

                System.out.println("Payment successful, redirecting to: " + redirectUrl);
                response.sendRedirect(redirectUrl);
            } else {
                // Xử lý payment thất bại - lưu transaction với status FAILED
                String failureReason = getVNPayResponseMessage(responseCode);

                vnPayService.handleFailedPayment(orderInfo, transactionId, paymentTime, amount, failureReason);

                // Redirect với thông báo thất bại và responseCode
                String redirectUrl = String.format(
                        "%s?status=failed&orderInfo=%s&transactionNo=%s&amount=%d&paymentTime=%s&responseCode=%s",
                        frontendUrl, orderInfo, transactionId, amount, paymentTime, responseCode);

                System.out.println("Payment failed (Code: " + responseCode + "), redirecting to: " + redirectUrl);
                response.sendRedirect(redirectUrl);
            }
        } catch (InvalidException e) {
            System.err.println("InvalidException in payment callback: " + e.getMessage());
            e.printStackTrace();
            String frontendUrl = "http://localhost:5173/student/payment-result";
            response.sendRedirect(frontendUrl + "?status=error&message=" + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error in payment callback: " + e.getMessage());
            e.printStackTrace();
            String frontendUrl = "http://localhost:5173/student/payment-result";
            response.sendRedirect(frontendUrl + "?status=error&message=Unexpected+error");
        }
    }

    private String getVNPayResponseMessage(String responseCode) {
        if (responseCode == null)
            return "Unknown error";

        switch (responseCode) {
            case "00":
                return "Giao dịch thành công";
            case "07":
                return "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)";
            case "09":
                return "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng";
            case "10":
                return "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần";
            case "11":
                return "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch";
            case "12":
                return "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa";
            case "13":
                return "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)";
            case "24":
                return "Giao dịch không thành công do: Khách hàng hủy giao dịch";
            case "51":
                return "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch";
            case "65":
                return "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày";
            case "75":
                return "Ngân hàng thanh toán đang bảo trì";
            case "79":
                return "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định";
            default:
                return "Giao dịch thất bại - Mã lỗi: " + responseCode;
        }
    }
}
