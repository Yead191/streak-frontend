import 'dart:math' as math;
import 'dart:ui' as ui;
import 'package:flutter/material.dart';

/// A premium bioluminescent entry preloader for Flutter.
///
/// Ports the web preloader from Next.js / GSAP to native Flutter.
/// Features:
/// - Deep cosmic radial background gradient.
/// - Breathing neon halo in the background.
/// - Vector logo drawing itself stroke-by-stroke.
/// - Bioluminescent green flood & outer neon glow.
/// - Tagline reveal with tracking and soft blur effect.
/// - Glowing neon accent divider.
/// - Smooth curtain fade-out before triggering [onComplete].
///
/// Usage:
/// ```dart
/// StreakPreloader(
///   onComplete: () {
///     Navigator.of(context).pushReplacement(
///       MaterialPageRoute(builder: (_) => const HomeScreen()),
///     );
///   },
/// )
/// ```
class StreakPreloader extends StatefulWidget {
  final VoidCallback? onComplete;
  final Duration totalDuration;

  const StreakPreloader({
    super.key,
    this.onComplete,
    this.totalDuration = const Duration(milliseconds: 5500),
  });

  @override
  State<StreakPreloader> createState() => _StreakPreloaderState();
}

class _StreakPreloaderState extends State<StreakPreloader>
    with TickerProviderStateMixin {
  // Main sequence controller
  late final AnimationController _mainController;
  // Looping halo breathing controller
  late final AnimationController _haloController;

  // Staged timeline animations
  late final Animation<double> _haloIntro;
  late final Animation<double> _strokeProgress1;
  late final Animation<double> _strokeProgress2;
  late final Animation<double> _fillOpacity;
  late final Animation<double> _taglineOpacity;
  late final Animation<double> _taglineSlide;
  late final Animation<double> _taglineBlur;
  late final Animation<double> _accentScale;
  late final Animation<double> _accentOpacity;
  late final Animation<double> _exitOpacity;

  // Pre-parsed logo paths
  late final Path _logoPath1;
  late final Path _logoPath2;
  bool _pathsReady = false;

  static const Color streakGreen = Color(0xFF7DFF57);
  static const Color streakOrange = Color(0xFFFF7A18);
  static const Color skyTop = Color(0xFF0F0B24);
  static const Color skyCenter = Color(0xFF1A1140);
  static const Color skyBottom = Color(0xFF050310);

  @override
  void initState() {
    super.initState();

    _parsePaths();

    // Independent breathing halo animation (2.6s yoyo)
    _haloController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2600),
    )..repeat(reverse: true);

    // Master timeline (~5.5 seconds total)
    _mainController = AnimationController(
      vsync: this,
      duration: widget.totalDuration,
    );

    // Staggered Timeline Intervals (matching the GSAP curve):
    // 0.00 -> 0.25 (0s - 1.4s): Halo intro scale & fade
    _haloIntro = CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.0, 0.25, curve: Curves.easeOut),
    );

    // 0.04 -> 0.48 (0.2s - 2.6s): First mark path strokes draw
    _strokeProgress1 = CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.04, 0.48, curve: Curves.easeInOut),
    );

    // 0.09 -> 0.53 (0.48s - 2.9s): Second mark path strokes draw
    _strokeProgress2 = CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.09, 0.53, curve: Curves.easeInOut),
    );

    // 0.42 -> 0.64 (2.3s - 3.5s): Bioluminescent green fills in
    _fillOpacity = CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.42, 0.64, curve: Curves.easeOut),
    );

    // 0.52 -> 0.80 (2.85s - 4.4s): Tagline drifts up & clears blur
    _taglineOpacity = CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.52, 0.74, curve: Curves.easeOut),
    );
    _taglineSlide = Tween<double>(begin: 18.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _mainController,
        curve: const Interval(0.52, 0.78, curve: Curves.easeOutCubic),
      ),
    );
    _taglineBlur = Tween<double>(begin: 6.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _mainController,
        curve: const Interval(0.52, 0.76, curve: Curves.easeOut),
      ),
    );

    // 0.65 -> 0.89 (3.6s - 4.9s): Accent line scales horizontally
    _accentScale = CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.65, 0.89, curve: Curves.easeOut),
    );
    _accentOpacity = CurvedAnimation(
      parent: _mainController,
      curve: const Interval(0.65, 0.82, curve: Curves.easeOut),
    );

    // 0.91 -> 1.00 (5.0s - 5.5s): Curtain fade exit
    _exitOpacity = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _mainController,
        curve: const Interval(0.91, 1.0, curve: Curves.easeInOut),
      ),
    );

    _mainController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        widget.onComplete?.call();
      }
    });

    _mainController.forward();
  }

  void _parsePaths() {
    // Exact path definitions from SVG
    const d1 =
        "M 874.277 912.415 C 1330.916 927.48 1430.443 554.862 853.284 559.93 C 740.864 560.917 716.082 561.752 714.796 501.833 C 712.574 398.281 578.585 342.371 352.297 344.045 C 133.652 345.662 -38.727 402.476 -51.168 494.797 C -57.778 531.85 -54.128 567.118 -7.472 599.828 C 82.99 665.666 279.541 704.911 440.035 693.065 C 544.007 685.391 535.127 779.774 491.436 795.393 C 419.364 821.158 360.53 806.999 282.197 791.173 C 223.62 779.338 82.441 708.157 64.82 698.829 C 28.707 685.655 -24.471 688.687 -22.952 723.305 C -22.826 736.447 1.64 797.999 108.755 864.07 C 172.726 903.529 414.392 934.721 507.472 921.085 C 654.302 1160.087 724.761 945.672 725.411 914.594 C 722.689 905.18 852.831 911.707 874.277 912.415 Z M 414.681 464.497 C 525.057 500.987 504.596 556.573 479.519 565.46 C 397.36 594.577 66.448 531.976 258.175 451.603 C 296.946 435.35 380.68 453.256 414.681 464.497 Z M 725.537 676.182 C 758.262 651.094 921.398 666.148 965.563 681.446 C 1046.005 709.309 1121.453 794.364 797.041 783.593 C 703.472 780.486 690.431 703.096 725.537 676.182 Z";

    const d2 =
        "M 1066.46 700.956 C 1048.22 637.315 960.507 585.556 857.822 577.287 C 819.743 573.833 781.078 574.67 742.665 574.513 C 707.096 575.35 690.024 574.983 692.785 549.338 C 696.049 446.971 585.16 374.957 419.956 376.631 C 278.771 374.276 147.545 432.369 139.511 524.69 C 135.243 561.743 142.189 599.634 172.317 632.344 C 230.733 698.182 358.193 709.381 457.282 740.469 C 500.801 752.715 494.356 778.622 493.268 803.796 C 488.749 840.751 390.832 839.646 356.268 820.595 C 319.612 801.912 225.789 738.05 214.41 728.722 C 191.09 715.548 137.526 703.758 138.507 738.376 C 138.588 751.518 137.084 870.321 213.995 910.981 C 265.548 939.915 334.76 953.374 403.134 954.264 C 422.467 954.573 441.883 953.992 461.048 952.587 C 471.091 951.848 480.016 953.95 487.661 955.351 C 582.476 1194.349 695.631 979.685 696.049 948.607 C 694.292 939.193 730.111 943.792 742.246 942.696 C 760.993 942.696 779.907 942.696 798.653 942.537 C 919.334 945.047 1031.73 895.124 1062.53 821.694 C 1073.74 795.422 1073.58 765.748 1073.49 738.062 C 1072.66 725.921 1069.39 712.157 1066.55 701.06 L 1066.55 700.851 L 1066.46 700.956 Z M 493.436 553.055 L 493.436 577.391 C 492.85 585.032 496.114 596.442 483.644 598.012 C 474.271 598.796 457.533 593.458 446.402 591.26 C 425.731 586.341 404.473 581.839 385.308 574.932 C 364.302 567.29 343.463 556.196 340.116 540.285 C 335.345 521.392 352.753 503.755 382.044 498.312 C 408.993 493.236 443.138 493.55 465.232 504.121 C 490.59 516.735 494.022 533.692 493.352 552.899 L 493.352 553.16 L 493.352 553.055 L 493.436 553.055 Z M 568.422 855.56 Z M 859.245 789.822 C 843.846 811.698 814.805 816.198 778.902 816.356 C 764.591 816.356 748.607 817.456 734.798 815.938 C 728.856 815.048 724.255 812.943 721.325 811.028 C 687.815 789.126 707.111 733.648 707.278 706.537 C 707.445 703.868 810.286 701.846 810.286 701.846 C 830.372 702.212 848.784 699.281 856.148 713.83 C 869.873 737.904 876.485 765.329 859.245 789.613 L 859.077 789.822 L 859.245 789.822 Z";

    // Build raw paths using SVG path mini parser
    final raw1 = SvgPathParser.parse(d1);
    final raw2 = SvgPathParser.parse(d2);

    // Apply SVG matrix transforms:
    // Path 1 transforms:
    // matrix(1, 0, 0, 1, 43.255245, 42.506786) * matrix(0.418407, 0, 0, 0.760576, 332.407257, 181.768723)
    final m1 = Matrix4.identity()
      ..translateByVector(Vector3(43.255245, 42.506786, 0.0))
      ..translateByVector(Vector3(332.407257, 181.768723, 0.0))
      ..scaleByVector(Vector3(0.418407, 0.760576, 1.0));
    _logoPath1 = raw1.transform(m1.storage);

    // Path 2 transforms:
    // matrix(1, 0, 0, 1, -1242.690186, 106.055557)
    final m2 = Matrix4.identity()
      ..translateByVector(Vector3(-1242.690186, 106.055557, 0.0));
    _logoPath2 = raw2.transform(m2.storage);

    _pathsReady = true;
  }

  @override
  void dispose() {
    _mainController.dispose();
    _haloController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return AnimatedBuilder(
      animation: Listenable.merge([_mainController, _haloController]),
      builder: (context, child) {
        // Overall exit curtain opacity
        return Opacity(
          opacity: _exitOpacity.value,
          child: Container(
            width: size.width,
            height: size.height,
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment(0.0, -0.16),
                radius: 1.1,
                colors: [
                  skyCenter,
                  skyTop,
                  skyBottom,
                ],
                stops: [0.0, 0.45, 1.0],
              ),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                // 1. Bioluminescent pulsing halo behind the mark
                _buildHalo(),

                // 2. Center Content: Logo + Tagline + Glowing Accent line
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Animated Streak Logo Mark
                    _buildLogoMark(),

                    const SizedBox(height: 32),

                    // Tagline: "ROOTED IN COMMUNITY"
                    _buildTagline(),

                    const SizedBox(height: 20),

                    // Glowing Accent Line
                    _buildAccentLine(),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildHalo() {
    // Breathing scale: 1.0 to 1.15; intro scale from 0.5
    final breathProgress = _haloController.value;
    final introScale = _haloIntro.value;
    final breathScale = 1.0 + (breathProgress * 0.15);
    final currentScale = introScale * breathScale;
    final haloOpacity = (_haloIntro.value * (0.55 + breathProgress * 0.3))
        .clamp(0.0, 1.0);

    return Transform.scale(
      scale: currentScale,
      child: Opacity(
        opacity: haloOpacity,
        child: Container(
          width: 320,
          height: 320,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              colors: [
                streakGreen.withValues(alpha: 0.45),
                streakOrange.withValues(alpha: 0.14),
                Colors.transparent,
              ],
              stops: const [0.0, 0.42, 0.70],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLogoMark() {
    if (!_pathsReady) return const SizedBox(height: 180, width: 210);

    return SizedBox(
      width: 210,
      height: 180,
      child: CustomPaint(
        painter: StreakLogoPainter(
          path1: _logoPath1,
          path2: _logoPath2,
          progress1: _strokeProgress1.value,
          progress2: _strokeProgress2.value,
          fillOpacity: _fillOpacity.value,
          color: streakGreen,
        ),
      ),
    );
  }

  Widget _buildTagline() {
    return Transform.translate(
      offset: Offset(0, _taglineSlide.value),
      child: Opacity(
        opacity: _taglineOpacity.value,
        child: ImageFiltered(
          imageFilter: ui.ImageFilter.blur(
            sigmaX: _taglineBlur.value,
            sigmaY: _taglineBlur.value,
          ),
          child: Text(
            "ROOTED IN COMMUNITY",
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.85),
              fontSize: 13,
              fontWeight: FontWeight.w600,
              letterSpacing: 4.8,
              shadows: [
                Shadow(
                  color: streakGreen.withValues(alpha: 0.7),
                  blurRadius: 16,
                ),
                Shadow(
                  color: streakGreen.withValues(alpha: 0.35),
                  blurRadius: 32,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAccentLine() {
    return Opacity(
      opacity: _accentOpacity.value,
      child: Transform.scale(
        scaleX: _accentScale.value,
        child: Container(
          width: 80,
          height: 1.5,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [
                Colors.transparent,
                streakGreen,
                Colors.transparent,
              ],
              stops: [0.0, 0.5, 1.0],
            ),
            boxShadow: [
              BoxShadow(
                color: streakGreen.withValues(alpha: 0.7),
                blurRadius: 12,
                spreadRadius: 1,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// CustomPainter that renders the vector logo with:
/// 1. Path metrics stroke trimming (drawing itself on)
/// 2. Bioluminescent outer neon drop-shadow glow
/// 3. Fill flood fade-in
class StreakLogoPainter extends CustomPainter {
  final Path path1;
  final Path path2;
  final double progress1;
  final double progress2;
  final double fillOpacity;
  final Color color;

  // Original SVG viewBox: 293.582 469.902 649.628 558.414
  static const Rect originalBounds =
      Rect.fromLTWH(293.582, 469.902, 649.628, 558.414);

  StreakLogoPainter({
    required this.path1,
    required this.path2,
    required this.progress1,
    required this.progress2,
    required this.fillOpacity,
    required this.color,
  });

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();

    // Scale and translate the paths to fit the widget viewport nicely
    final scaleX = size.width / originalBounds.width;
    final scaleY = size.height / originalBounds.height;
    final scale = math.min(scaleX, scaleY);

    final offsetX = (size.width - originalBounds.width * scale) / 2 -
        originalBounds.left * scale;
    final offsetY = (size.height - originalBounds.height * scale) / 2 -
        originalBounds.top * scale;

    canvas.translate(offsetX, offsetY);
    canvas.scale(scale);

    // 1. Draw outer neon glow if fill or stroke is active
    if (fillOpacity > 0.05 || progress1 > 0.2) {
      final glowPaint = Paint()
        ..color = color.withValues(alpha: 0.45 * math.max(progress1, fillOpacity))
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 18);

      final outerGlowPaint = Paint()
        ..color = color.withValues(alpha: 0.25 * math.max(progress1, fillOpacity))
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 46);

      if (fillOpacity > 0.01) {
        canvas.drawPath(path1, outerGlowPaint);
        canvas.drawPath(path2, outerGlowPaint);
        canvas.drawPath(path1, glowPaint);
        canvas.drawPath(path2, glowPaint);
      }
    }

    // 2. Stroke paint for drawing paths
    final strokePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 9.0
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    // Draw stroked path 1
    if (progress1 > 0) {
      _drawTrimmedPath(canvas, path1, progress1, strokePaint);
    }

    // Draw stroked path 2
    if (progress2 > 0) {
      _drawTrimmedPath(canvas, path2, progress2, strokePaint);
    }

    // 3. Fill paint for bioluminescent flood
    if (fillOpacity > 0) {
      final fillPaint = Paint()
        ..color = color.withValues(alpha: fillOpacity)
        ..style = PaintingStyle.fill;

      canvas.drawPath(path1, fillPaint);
      canvas.drawPath(path2, fillPaint);
    }

    canvas.restore();
  }

  void _drawTrimmedPath(
      Canvas canvas, Path source, double progress, Paint paint) {
    if (progress >= 1.0) {
      canvas.drawPath(source, paint);
      return;
    }

    final pathMetrics = source.computeMetrics();
    for (final metric in pathMetrics) {
      final extractLength = metric.length * progress;
      final extractedPath = metric.extractPath(0.0, extractLength);
      canvas.drawPath(extractedPath, paint);
    }
  }

  @override
  bool shouldRepaint(covariant StreakLogoPainter oldDelegate) {
    return oldDelegate.progress1 != progress1 ||
        oldDelegate.progress2 != progress2 ||
        oldDelegate.fillOpacity != fillOpacity ||
        oldDelegate.color != color;
  }
}

/// Helper vector math class
class Vector3 {
  final double x, y, z;
  const Vector3(this.x, this.y, this.z);
}

extension Matrix4Ext on Matrix4 {
  void translateByVector(Vector3 v) => translate(v.x, v.y, v.z);
  void scaleByVector(Vector3 v) => scale(v.x, v.y, v.z);
}

/// Standalone SVG Path Parser that converts standard SVG path strings (M, C, Z)
/// into Flutter [Path] instances without requiring third-party packages.
class SvgPathParser {
  static Path parse(String svgPath) {
    final path = Path();
    final tokens = _tokenize(svgPath);

    int i = 0;
    while (i < tokens.length) {
      final token = tokens[i];
      if (token == 'M' || token == 'm') {
        final x = double.parse(tokens[++i]);
        final y = double.parse(tokens[++i]);
        path.moveTo(x, y);
      } else if (token == 'C' || token == 'c') {
        while (i + 6 < tokens.length && !_isCommand(tokens[i + 1])) {
          final x1 = double.parse(tokens[++i]);
          final y1 = double.parse(tokens[++i]);
          final x2 = double.parse(tokens[++i]);
          final y2 = double.parse(tokens[++i]);
          final x = double.parse(tokens[++i]);
          final y = double.parse(tokens[++i]);
          path.cubicTo(x1, y1, x2, y2, x, y);
        }
      } else if (token == 'Z' || token == 'z') {
        path.close();
      }
      i++;
    }
    return path;
  }

  static bool _isCommand(String s) {
    if (s.isEmpty) return false;
    final c = s[0];
    return 'MCZSLHVTAQ'.contains(c.toUpperCase());
  }

  static List<String> _tokenize(String d) {
    final result = <String>[];
    final buffer = StringBuffer();

    void flush() {
      if (buffer.isNotEmpty) {
        result.add(buffer.toString());
        buffer.clear();
      }
    }

    for (int j = 0; j < d.length; j++) {
      final char = d[j];
      if (char == ' ' || char == ',') {
        flush();
      } else if (_isCommand(char)) {
        flush();
        result.add(char);
      } else if (char == '-' && buffer.isNotEmpty) {
        flush();
        buffer.write(char);
      } else {
        buffer.write(char);
      }
    }
    flush();
    return result;
  }
}
